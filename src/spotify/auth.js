import fetch from 'node-fetch'
import btoa from 'btoa'
import { saveTokensToFirebase, getTokensFromFirebase } from '../firebase'
import { updateLocalTokens, databaseTokensChanged } from '../server'

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env

const combineQueryParams = (params) => {
  // might better live in index
  const parameters = Object.keys(params)
  const query = parameters.map((parameter) => `${parameter}=${params[parameter]}`).join(`&`)
  return query
}

export const constructAuthURI = async (redirect) => {
  const root = `https://accounts.spotify.com/authorize?`
  const params = {
    client_id: SPOTIFY_CLIENT_ID,
    scope: [
      'user-read-email',
      'user-read-private',
      'playlist-modify-private',
      'user-read-private',
      'playlist-modify-public',
    ].join(' '),
    response_type: 'code',
    redirect_uri: redirect,
  }
  return root + combineQueryParams(params)
}

export const requestAccessToken = (code, redirect) => {
  const client = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)
  const params = {
    client_id: SPOTIFY_CLIENT_ID,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirect,
  }

  return fetch(`https://accounts.spotify.com/api/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${client}`,
    },
    body: combineQueryParams(params),
  })
  .then((response) => {
    if (response.ok) {
      return response
        .text()
        .then((text) => JSON.parse(text))
        .then((tokens) => {
          console.log('Successful authentication')
          saveTokensToFirebase(tokens)
          return { ...tokens, error: '' }
        })
    } else {
      response.text().then((text) => {
        return { error: text, access_token: '', refresh_token: '' }
      })
    }
  })
}

export const getRefreshedAuth = async () => {
  console.log('spinning the wax')
  try { 
    const databaseTokens = await getTokensFromFirebase()
    if (await databaseTokensChanged()) {
      console.log('tokens changed')
      updateLocalTokens(databaseTokens)
      return databaseTokens
    }
  
    const params = {
      grant_type: 'refresh_token',
      refresh_token: databaseTokens.refresh_token,
      client_id: SPOTIFY_CLIENT_ID,
    }
  
    const client = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)
  
    return fetch(`https://accounts.spotify.com/api/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${client}`,
      },
      body: combineQueryParams(params),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Successfully refreshed the token')
  
          return response
            .text()
            .then((text) => JSON.parse(text))
            .then((tokens) => {
              updateLocalTokens({
                access_token: tokens.access_token, refresh_token: databaseTokens.refresh_token
              })
              saveTokensToFirebase(tokens, databaseTokens.refresh_token)
              return tokens
            })
            .catch(error => ({ error: error, refresh_token: '', access_token: '' }))
        } else {
          return response
            .text()
            .then((text) => ({ error: text, refresh_token: '', access_token: '' }))
        }
      })
      .catch((error) => console.error(error))
  } catch (error) {
    console.error(error)
  }
}
