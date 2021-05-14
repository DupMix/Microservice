const { FIRE_DATABASE_URL } = process.env

const resolvers = {
  Query: {
    users: async () => {
      const data = await fetch(`${FIRE_DATABASE_URL}/users.json`)
      return await data.json()
      // const keys = Object.keys(dataJson) // seems like an extra cleaning step
      // const keyMap = keys.map((user) => {
      //   const userData = dataJson[user]
      //   const graphqlUser = userProfile(userData)
      //   return graphqlUser
    }  
  }
}

export default resolvers