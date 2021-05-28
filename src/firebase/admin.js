import * as admin from 'firebase-admin'
import { Storage } from '@google-cloud/storage'
require('dotenv').config()

const { FIRE_DATABASE_URL, FIRE_PROJECT_ID, GOOGLE_APPLICATION_CREDENTIALS } = process.env
const serviceAccount = require(GOOGLE_APPLICATION_CREDENTIALS)
// const storage = new Storage({ FIRE_PROJECT_ID, GOOGLE_APPLICATION_CREDENTIALS })

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: FIRE_DATABASE_URL,
})

export const auth = admin.auth()

export default admin