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
    response.send(`Welcome to Mixdup. ${app.locals.access_token && 'I am powered by Spotify.'}`)
  } else {
    const authUri = await constructAuthURI('http://localhost:8000/authorize')
    return authUri ? response.redirect(authUri) : response.send('something went wrong')
  }
})

app.get('/authorize', async (request, response) => {
  const code = request.query.code
  const tokens = await requestAccessToken(code, 'http://localhost:8000/authorize')
  if (tokens && tokens.access_token && tokens.refresh_token) {
    updateLocalTokens(tokens)
    saveTokensToFirebase(tokens)
    response.redirect('http://localhost:8000')
  } else {
    response.redirect('http://localhost:8000') // would be nice if there was some handling
  }
})

app.post('/search-spotify', checkIfAuthenticated, (request, response) => {
  console.log('searching...')
  const { query } = request.body
  return performAuthorizedSpotifyAction(searchSpotify, query, response)
})

app.post('/contest-playlist', async (request, response) => {
  const { date } = request.body
  if (!date) response.status(403).json('You must provide a date to get a playlist')
  try {
    const playlist = getDay(parseISO(date)) >= 3 ? await getThisWeeksPlaylistDynamically(date) : await getLastWeeksPlaylistDynamically(date)
    playlist ? performAuthorizedSpotifyAction(getPlaylist, playlist.spotify_playlist_id, response) : response.status(404)
  } catch (error) {
    console.error(error)
    response.status(error.status || 500).json({ error })
  }
})

app.post('/submit-song', checkIfAuthenticated, async (request, response) => {
  try {
    const {user_id, submission_uri, trackName, date} = request.body
    const playlist_id = await attemptSubmissionToFirebase(user_id, submission_uri, trackName, date, response)
    playlist_id && await useSpotify(submitToPlaylist, { playlist_id, submission_uri })
    response.status(200).send()
  } catch (error) {
    console.error('submit-song-endpoint:', error)
  }
})

app.post('/submit-votes', checkIfAuthenticated, async (request, response) => {
  try {
    const { user_id, votes, date } = request.body
    if (await userVotedThisWeek(user_id, date)) return response.status(429).send()
    submitVotesToFirebase(user_id, votes, date)
    response.status(201).send()
  } catch (error) {
    console.error(error)
    response.status(error.status || 500).json({ error })
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
    console.error('The server needs to be authorized for Spotify. Go to http://localhost:8000')
  }
}

app.listen({ port: 8000 }, async () => {
  console.log(`The Mixdup server is running on http://localhost:8000`)  
  checkTokens()
})