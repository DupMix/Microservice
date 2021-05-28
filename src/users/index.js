import admin from '../firebase/admin'

const getAuthToken = (request, response, next) => {
  const { authorization } = request.headers
  const authParts = authorization ? authorization.split(' ') : []
  if (authParts[0] === 'Bearer') {
    request.authToken = authParts[1]
  } else {
    request.authToken = null
  }
  next()
}

export const checkIfAuthenticated = (request, response, next) => {
  getAuthToken(request, response, async () => {
    try {
      const { authToken } = request
      const userInfo = await admin
        .auth()
        .verifyIdToken(authToken)
      request.authId = userInfo.uid
      return next()
    } catch (error) {
      return response.status(401).send({ 
        error: 'You are not authorized to make this request'
      })
    }
  })
}
