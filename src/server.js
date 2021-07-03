import express from 'express'
import cors from 'cors'
import { getDay, parseISO } from 'date-fns'
import { checkIfAuthenticated } from './users'
import performAuthorizedSpotifyAction, { 
  useSpotify,
  constructAuthURI, 
  requestAccessToken, 
  searchSpotify, 
  getPlaylist,
  submitToPlaylist
} from './spotify'
import { 
  saveTokensToFirebase, 
  getTokensFromFirebase, 
  getLastWeeksPlaylistDynamically,
  getThisWeeksPlaylistDynamically, 
  attemptSubmissionToFirebase,
  userVotedThisWeek,
  submitVotesToFirebase
} from './firebase'
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

app.locals = {
  access_token: '',
  refresh_token: '',
}

const port = process.env.PORT || 8000

const baseUrl =
  process.env.NODE_ENV === 'developement'
    ? 'https://mixdup-microservice.herokuapp.com/'
    : 'http://localhost:8000'

export const updateLocalTokens = ({ access_token, refresh_token }) => {
  app.locals.access_token = access_token
  app.locals.refresh_token = refresh_token
}

export const databaseTokensChanged = async () => {
  const databaseTokens = await getTokensFromFirebase()
  return app.locals.access_token !== databaseTokens.access_token
}

app.get('/', async (request, response) => {
  if (app.locals.access_token) {
    response
      .send(`Welcome to Mixdup. ${app.locals.access_token && 'I am powered by Spotify.'}`)
      .set('Access-Control-Allow-Origin', '*')
  } else {
    const authUri = await constructAuthURI(`${baseUrl}/authorize`)
    return authUri ? response.redirect(authUri) : response.send('something went wrong').set('Access-Control-Allow-Origin', '*')
  }
})

app.get('/authorize', async (request, response) => {
  const code = request.query.code
  const tokens = await requestAccessToken(code, `${baseUrl}/authorize`)
  if (tokens && tokens.access_token && tokens.refresh_token) {
    updateLocalTokens(tokens)
    saveTokensToFirebase(tokens)
    response.redirect(baseUrl)
  } else {
    response.redirect(baseUrl) // would be nice if there was some handling
  }
})

app.post('/search-spotify', checkIfAuthenticated, (request, response) => {
  console.log('searching...')
  const { query } = request.body
  return performAuthorizedSpotifyAction(searchSpotify, query, response)
})

app.post('/contest-playlist', async (request, response) => {
  const { date } = request.body
  if (!date) response
    .status(403)
    .json('You must provide a date to get a playlist')
    .set('Access-Control-Allow-Origin', '*')
  try {
    const playlist = getDay(parseISO(date)) >= 3 ? await getThisWeeksPlaylistDynamically(date) : await getLastWeeksPlaylistDynamically(date)
    playlist
      ? performAuthorizedSpotifyAction(getPlaylist, playlist.spotify_playlist_id, response)
      : response.status(404).set('Access-Control-Allow-Origin', '*')
  } catch (error) {
    console.error(error)
    response
      .status(error.status || 500)
      .json({ error })
      .set('Access-Control-Allow-Origin', '*')
  }
})

app.post('/submit-song', checkIfAuthenticated, async (request, response) => {
  try {
    const {user_id, submission_uri, trackName, date} = request.body
    const playlist_id = await attemptSubmissionToFirebase(user_id, submission_uri, trackName, date, response)
    playlist_id && await useSpotify(submitToPlaylist, { playlist_id, submission_uri })
    response.status(200).set('Access-Control-Allow-Origin', '*').send()
  } catch (error) {
    console.error('submit-song-endpoint:', error)
  }
})

app.post('/submit-votes', checkIfAuthenticated, async (request, response) => {
  try {
    const { user_id, votes, date } = request.body
    if (await userVotedThisWeek(user_id, date)) return response.status(429).set('Access-Control-Allow-Origin', '*').send()
    submitVotesToFirebase(user_id, votes, date)
    response.status(201).set('Access-Control-Allow-Origin', '*').send()
  } catch (error) {
    console.error(error)
    response
      .status(error.status || 500)
      .json({ error })
      .set('Access-Control-Allow-Origin', '*')
  }
})

export const checkTokens = async () => {
  console.log('Checking for Spotify tokens')
  if (app.locals.access_token !== '' && app.locals.refresh_token !== '') {
    console.log('Found local tokens')
    return { access_token: app.locals.access_token }
  }
  const tokens = await getTokensFromFirebase()
  if (tokens?.access_token && tokens?.refresh_token) {
    console.log('Tokens retrieved from the database')
    updateLocalTokens(tokens)
    return tokens.access_token
  } else {
    console.error('The server needs to be authorized for Spotify.')
  }
}

app.listen(port, async () => {
  console.log(`The Mixdup server is running on http://localhost:${port}`)  
  checkTokens()
})