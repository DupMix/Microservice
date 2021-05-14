import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import firebase from 'firebase'
require('dotenv').config()

import typeDefs from './typeDefs'
import resolvers from './resolvers'

const { FIRE_API_KEY, FIRE_AUTH_DOMAIN, FIRE_DATABASE_URL, FIRE_PROJECT_ID } = process.env

const app = express()

const firebaseClient = firebase.initializeApp({
  apiKey: FIRE_API_KEY,
  authDomain: FIRE_AUTH_DOMAIN,
  databaseURL: FIRE_DATABASE_URL,
  projectId: FIRE_PROJECT_ID
})

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ headers: req.headers, firebaseClient })
})

server.applyMiddleware({ app })

app.listen({ port: 8000 }, () => {
  console.log(`The Mixdup server is running on http://localhost:8000`)  
})