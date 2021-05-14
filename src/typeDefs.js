import { gql } from 'apollo-server'

const typeDefs = gql`
  type User {
    username: String!
    email: String!
    lastName: String
    firstName: String
  }

  type Query {
    users: [User]
  }
`

export default typeDefs