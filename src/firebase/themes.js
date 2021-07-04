import admin from './admin'

export const getThemesFromFirebase = async () => {
  try {
    const snapshot = await admin.database().ref().child('themes').get()
    return snapshot.exists() && snapshot.val()
  } catch (error) {
    console.error(error)
  }
}

export const removeThemeFromFirebase = async (item) => {
  try {
    admin.database().ref(`/themes/${item}`).remove()
  } catch (error) {
    console.error(error)
  }
}

export const selectANewTheme = async () => {
  const themes = await getThemesFromFirebase()
  const items = Object.keys(themes)
  const index = Math.trunc(Math.random() * items.length + 0)
  const theme = themes[items[index]]
  // await removeThemeFromFirebase(items[index])
  return theme
}