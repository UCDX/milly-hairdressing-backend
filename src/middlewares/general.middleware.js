const cryptService = require('../services/crypt.service')

function apiSection(req, res, next) {
  req.api = {}
  next()
}

function userAuth(req, res, next) {
  let token = req.headers.authorization
  if (!token) {
    return res.status(401).json({
      messages: ['Authentication is missing']
    })
  }
  try {
    let payload = cryptService.decodeJWT(token)
    req.api.user_id = payload.user_id
    return next()
  } catch (err) {
    console.log('Error while decoding token')
    console.log(err.message)
    res.status(500).end()
  }
}

module.exports = {
  apiSection,
  userAuth
}
