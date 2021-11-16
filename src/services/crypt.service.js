const crypto = require('crypto')
const jwt = require('jwt-simple')

const secret = 'milly-hairdressing'

function hash(data) {
  const hash = crypto.createHash('sha256');
  hash.update(data)
  return hash.digest('hex')
}

function generateJWT(payload) {
  return jwt.encode(payload, secret)
}

function decodeJWT(token) {
  return jwt.decode(token, secret)
}

module.exports = {
  hash,
  generateJWT,
  decodeJWT
}
