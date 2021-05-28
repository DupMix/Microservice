import admin from './admin'
// import { updateLocalTokens } from '../server'

export const saveTokensToFirebase = async (tokens, refresh_token) => {
  const tokenUpdate = { ...tokens }
  if (refresh_token) tokenUpdate.refresh_token = refresh_token
  try {
    await admin.database().ref('mixdup_tokens').set({ ...tokenUpdate })
    console.log('tokens saved to database')
  } catch (error) {
    console.error('error saving tokens to database:', error)
  }
}

export const getTokensFromFirebase = async () => {
  try {
    const snapshot = await admin.database().ref().child('mixdup_tokens').get()
    if (snapshot.exists()) {
      const { access_token, refresh_token } = snapshot.val()
      return { access_token, refresh_token }
    }
  } catch (error) {
    console.error(error)
  }
}