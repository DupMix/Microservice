import fetch from 'node-fetch'
import { format } from 'date-fns'
import { savePlaylistToFirebase, selectANewTheme } from '../firebase'

const getName = async () => {
  try {
    const data = await fetch(`https://random-word-api.herokuapp.com/word?number=${Math.trunc(Math.random() * (4 - 2) + 2)}&swear=0`)
    const text = await data.text()
    const names = JSON.parse(text)
    return names.join(' ')
  } catch (error) {
    console.error(error)
    return 'J. Doe'
  }
}

// const getTheme = async () => {
//   try {
//     const data = await fetch (`https://api.quotable.io/random`)  
//     console.log(data)
//     return data.content
//   } catch (error) {
//     console.error(error)
//     return 'Error generating theme'
//   }
// }

export const makePlaylist = async (access_token, date) => {
  const name = await getName()
  const theme = await selectANewTheme()
  try {
    const data = await fetch('https://api.spotify.com/v1/users/e7ermk7v6qi3y0mbqibh5do2k/playlists', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'content-type': 'application/json', // this was .json for a second and didn't have issues?
      },
      body: JSON.stringify({
        name: name,
        description: theme
      }),
    })
    return data.ok && data.text().then(text => JSON.parse(text)).then(data => {
      savePlaylistToFirebase(data.id, data.name, date, theme)
      return data.id
    })
  } catch (error) {
    console.error('make-playlist-error', error)
  }
}

export const getPlaylist = (access_token, playlist_id) => {
  return fetch(`https://api.spotify.com/v1/playlists/${playlist_id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      'content-type': 'application/json', // this was .json for a second and didn't have issues?
    },
  })
    .then((response) => response)
    .catch((error) => console.error(error))
}

export const submitToPlaylist = async (access_token, { playlist_id, submission_uri }) => {
  try {
    return await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${access_token}`
      },
      body: JSON.stringify({uris: [submission_uri]})
    })
  } catch (error) {
    console.error('submit-to-spotify-playlist:', error)
  }
}

// determine last weeks playlist
  // get all playlists 
  // sort and find the most recent one that's over a week old

// addSongs to this weeks playlist
  // get all playlists
