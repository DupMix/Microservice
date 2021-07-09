import admin from './admin'
import { isBefore, isAfter, sub, getDay, nextWednesday, format, parseISO } from 'date-fns'

export const savePlaylistToFirebase = (id, name, date) => {
  try {
    const playlists = admin.database().ref('playlists/')
    const newPlaylist = playlists.push()
    newPlaylist.set({
      spotify_playlist_id: id,
      name,
      theme: 'test_theme',
      updated_at: format(parseISO(date) || new Date(), 'yyyy-MM-dd'),
      created_at: format(parseISO(date) || new Date(), 'yyyy-MM-dd'),
    })
  } catch (error) {
    console.error(error)
  }
}

export const getPlaylistsFromFirebase = async () => {
  try {
    const snapshot = await admin
      .database()
      .ref()
      .child('playlists')
      .get()
    return snapshot.exists() && snapshot.val()
  } catch (error) {
    console.error(error)
  }
}

export const getLastWeeksPlaylistDynamically = async (today) => {
  const parsedDate = parseISO(today)
  const twoSundaysAgo = sub(parsedDate, { days: getDay(parsedDate) + 7})
  try {
    const playlists = Object.values(await getPlaylistsFromFirebase())
    return playlists.find(({ created_at }) => {
      const made = parseISO(created_at)
      return (isBefore(made, nextWednesday(twoSundaysAgo)) && isAfter(made, twoSundaysAgo))
    })
  } catch (error) {
    console.error(error.message)
  }
}

export const getThisWeeksPlaylistDynamically = async (today, forSubmission) => {
  const parsedDate = parseISO(today)
  const lastSunday = sub(parsedDate, { days: getDay(parsedDate) + 1 })
  const lastSaturday = sub(lastSunday, { days: 1 } )
  try {
    const playlists = Object.values(await getPlaylistsFromFirebase())
    const result =  playlists.find(({ created_at }, i) => {
      const made = parseISO(created_at)
      return (
        isAfter(made, forSubmission ? lastSaturday : lastSunday) &&
        isBefore(made, nextWednesday(lastSunday))
        )
      }) 
      return result
  } catch(error) {
    console.error(error.message)
  }
}

const getAllSubmissions = async () => {
  try {
    const snapshot = await admin
      .database()
      .ref()
      .child('submission')
      .get()
    return snapshot.exists() && snapshot.val()
  } catch (error) {
    console.error(error)
  }
}

const checkForExistingSubmission = async (user, playlist_id) => {
  try {
    const submissionList = await getAllSubmissions()
    const submissions = Object.values(submissionList)
    const playlistRelevantSubmissions = submissions
      .filter(({ spotify_playlist_id }) => spotify_playlist_id === playlist_id)
    if (playlistRelevantSubmissions.some(({ userId }) => userId === user)) 
      return true
    } catch (error) {
      console.error(error)
    }
  }
// submission: userId, submission_uri, created_at, spotify_playlist_id

export const attemptSubmissionToFirebase = async (userId, submission_uri, trackName, date, response) => { 
  try {
    // let newId;
    const thisWeeksPlaylist =  await getThisWeeksPlaylistDynamically(date, true)
    // if (!thisWeeksPlaylist) {
    //   newId = await useSpotify(makePlaylist, date).id
    //   if (!newId) return response.set('Access-Control-Allow-Origin', '*').status(500)
    // } else {
      const exists = await checkForExistingSubmission(userId, thisWeeksPlaylist?.spotify_playlist_id)
      if (exists) return response.set('Access-Control-Allow-Origin', '*').status(429)
    // }
      // const playlist = thisWeeksPlaylist ? thisWeeksPlaylist.spotify_playlist_id : newId
      await saveSubmissionToFirebase(thisWeeksPlaylist.spotify_playlist_id, userId, submission_uri, trackName, date)
      return thisWeeksPlaylist
  } catch (error) {
    console.error('firebase-submission-error:', error)
  }
}

export const saveSubmissionToFirebase = async (spotify_playlist_id, userId, submission_uri, trackName, date) => {
  try {
    const newSubmission = await admin.database().ref('submission/').push()
    newSubmission.set({
      spotify_playlist_id,
      userId,
      trackName,
      submission_uri,
      created_at: format(parseISO(date), 'yyyy-MM-dd'),
    })
  } catch (error) {
    console.error(error)
  }
}