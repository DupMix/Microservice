import * as admin from 'firebase-admin'
import { Storage } from '@google-cloud/storage'
import GOOGLE_CREDENTIALS from '../google_credentials'
require('dotenv').config()

const { FIRE_DATABASE_URL, FIRE_PROJECT_ID, GOOGLE_APPLICATION_CREDENTIALS } = process.env
// const storage = new Storage({ FIRE_PROJECT_ID, GOOGLE_APPLICATION_CREDENTIALS })


  admin.initializeApp({
    credential: admin.credential.cert(GOOGLE_CREDENTIALS),
    databaseURL: FIRE_DATABASE_URL,
  })

export const auth = admin.auth()

export default admin