import express from 'express'
import cors from 'cors'
import 'regenerator-runtime/runtime'
import { getDay, parseISO } from 'date-fns'
import { checkIfAuthenticated } from './users'
import performAuthorizedSpotifyAction, { 
  useSpotify,
  constructAuthURI, 
  requestAccessToken, 
  searchSpotify, 
  getPlaylist,
  submitToPlaylist,
  makePlaylist,
  getPlaylists
} from './spotify'
import { 
  saveTokensToFirebase, 
  getTokensFromFirebase, 
  getLastWeeksPlaylistDynamically,
  getThisWeeksPlaylistDynamically, 
  attemptSubmissionToFirebase,
  userVotedThisWeek,
  submitVotesToFirebase,
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
      .set('Access-Control-Allow-Origin', '*')
      .send(`Welcome to Mixdup. ${app.locals.access_token && 'I am powered by Spotify.'}`)
  } else {
    const authUri = await constructAuthURI(`http://localhost:8000/authorize`)
    return authUri
      ? response.redirect(authUri)
      : response.set('Access-Control-Allow-Origin', '*').send('something went wrong')
  }
})

app.get('/authorize', async (request, response) => {
  const code = request.query.code
  const tokens = await requestAccessToken(code, `http://localhost:8000/authorize`)
  if (tokens && tokens.access_token && tokens.refresh_token) {
    updateLocalTokens(tokens)
    saveTokensToFirebase(tokens)
    response.redirect('localhost:8000')
  } else {
    response.redirect('localhost:8000') // would be nice if there was some handling
  }
})

app.post('/search-spotify', checkIfAuthenticated, (request, response) => {
  const { query } = request.body
  return performAuthorizedSpotifyAction(searchSpotify, query, response)
})

app.post('/contest-playlist', async (request, response) => {
  const { date } = request.body
  if (!date) response
    .set('Access-Control-Allow-Origin', '*')
    .status(403)
  try {
    const playlist = getDay(parseISO(date)) >= 3 ? await getThisWeeksPlaylistDynamically(date) : await getLastWeeksPlaylistDynamically(date)
    if (!playlist) return response.set('Access-Control-Allow-Origin', '*').status(404)
    const playlistData = await useSpotify(getPlaylist, playlist.spotify_playlist_id)
    response.set('Access-Control-Allow-Origin', '*').status(200).json(playlistData)
  } catch (error) {
    console.error(error)
    response
      .set('Access-Control-Allow-Origin', '*')
      .status(error.status || 500)
      .json({ error })
  }
})

app.post('/new-theme-new-list', checkIfAuthenticated, async (request, response) => {
  const { date } = request.body
  try {
    const playlist = await getThisWeeksPlaylistDynamically(date, true)
    if (playlist) return response.set('Access-Control-Allow-Origin', '*').status(200).send(playlist.theme)
    const newList = await useSpotify(makePlaylist, date)
    return response.set('Access-Control-Allow-Origin').status(201).send(newList?.theme)
  } catch (error) {
    console.error(error)
    response
      .set('Access-Control-Allow-Origin', '*')
      .status(error.status || 500)
      .json({ error })
  }
})

app.post('/submit-song', checkIfAuthenticated, async (request, response) => {
  try {
    const {user_id, submission_uri, trackName, date} = request.body
    const { spotify_playlist_id } = await attemptSubmissionToFirebase(user_id, submission_uri, trackName, date, response)
    if (spotify_playlist_id) {
      await useSpotify(submitToPlaylist, { spotify_playlist_id, submission_uri })
      response.set('Access-Control-Allow-Origin', '*').status(200)
    }
    response.send()
  } catch (error) {
    console.error('submit-song-endpoint:', error)
  }
})

app.post('/submit-votes', checkIfAuthenticated, async (request, response) => {
  try {
    const { user_id, votes, date } = request.body
    if (await userVotedThisWeek(user_id, date)) return response.set('Access-Control-Allow-Origin', '*').status(429).send()
    submitVotesToFirebase(user_id, votes, date)
    response.set('Access-Control-Allow-Origin', '*').status(201).send()
  } catch (error) {
    console.error(error)
    response
      .set('Access-Control-Allow-Origin', '*')
      .status(error.status || 500)
      .json({ error })
  }
})

app.get('/all-playlists', checkIfAuthenticated, async (request, response) => {
  try {
    const playlists = await useSpotify(getPlaylists)
    response.set('Access-Control-Allow-Origin', '*').status(200).json(playlists)
  } catch (error) {
    console.error('all-playlist-error', error)
  }
})

app.post('/get-playlist', checkIfAuthenticated, async (request, response) => {
  const { playlist_id } = request.body
  try {
    const playlist = await useSpotify(getPlaylist, playlist_id)
    response.set('Access-Control-Allow-Origin', '*').status(200).json(playlist)
  } catch(error) {
    console.error('get-playlist-error', error)
  }
})

export const checkTokens = async () => {
  if (app.locals.access_token !== '' && app.locals.refresh_token !== '') {
    return { access_token: app.locals.access_token }
  }
  const tokens = await getTokensFromFirebase()
  if (tokens?.access_token && tokens?.refresh_token) {
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