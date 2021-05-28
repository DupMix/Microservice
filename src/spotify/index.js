import fetch from 'node-fetch'
import { getRefreshedAuth } from './auth'
import { checkTokens } from '../server'

export const useSpotify = async (spotifyAction, query) => {
  const { access_token } = await checkTokens()
  try {
    return await spotifyAction(access_token, query)
  } catch (error) {
    const { access_token, error: new_error } = error.status === 401 && await getRefreshedAuth()
    return access_token ? spotifyAction(access_token, query) : console.error(new_error)
  }
}

const performAuthorizedSpotifyAction = async (spotifyAction, query, res) => {
  const { access_token } = await checkTokens()
 
  return spotifyAction(access_token, query).then((response) => {
    if (response?.ok) {
      console.log('Successfully completed Spotify action')
      return response
        .text()
        .then((text) => {
          res && res.send(text)
          return(text)
        })
        .catch((error) => console.error(error))
    } else if (response.status === 401) {
      return getRefreshedAuth().then(({ access_token: new_Access, error }) => {
        if (new_Access) {
          console.log('Refreshed Authentication')
          return spotifyAction(new_Access, query).then((secondResponse) => {
            console.log('Rerunning the spotify task...')
            if (secondResponse.ok) {
              secondResponse
                .text()
                .then((text) => {
                  res.send(text)
                  return(text)
                })
                .catch((error) => console.error(error))
              return secondResponse
            } else {
              console.error('Something went wrong the second time we attempted the Spotify action')
              secondResponse
                .text()
                .then((text) => console.error(JSON.parse(text)))
                .catch((error) => console.error(error))
              return secondResponse
            }
          })
        } else {
          console.error(error)
        }
      })
    } else {
      response
        .text()
        .then((text) => console.error(JSON.parse(text)))
        .catch((error) => console.error(error))
      return response
    }
  }).catch(error => console.error(error))
}

export const searchSpotify = (accessSpotify, query) => {
  const bearer = `Bearer ${accessSpotify}`
  return fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer,
    },
  }).then((response) => {
    return response
  })
}

export { getRefreshedAuth, constructAuthURI, requestAccessToken } from './auth'
export { makePlaylist, getPlaylist, submitToPlaylist } from './playlists'
export default performAuthorizedSpotifyAction
