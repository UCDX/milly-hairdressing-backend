const EventEmitter = require('events')
const cryptService = require('../services/crypt.service')
const { 
  Validator, 
  parseNumberFromGroupIfApplic,
  parseValidatorOutput } = require('../services/validator.service')

/**
 * Set an event emitter to response.api.events and
 * make available the method 'finish' that set a response
 * format for the REST APIs and emits a event when this
 * method has been called. The event name is 'finished'.
 */
function setResponseFormat(req, res, next) {
  res.api = { events: new EventEmitter() }
  res.finish = (r = {}) => {
    r = res.json({
      code: (r.code !== undefined && r.code !== null) ? (r.code) : (0),
      messages: r.messages || [],
      data: r.data || {}
    })
    res.api.events.emit('finished')
    return r
  }

  return next()
}

function apiSection(req, res, next) {
  req.api = {}
  next()
}

function userAuth(req, res, next) {
  let token = req.headers.authorization
  if (!token) {
    return res.status(401).finish({
      code: -2,
      messages: ['Authentication is missing']
    })
  }
  try {
    let payload = cryptService.decodeJWT(token)
    req.api.user_id = payload.user_id
    return next()
  } catch (err) {
    console.log(err.message)
    res.status(500).finish({
      code: -3,
      messages: ['Error while decoding token']
    })
  }
}

function checkPaginationParams(req, res, next) {
  let validator = new Validator()
  req.query = parseNumberFromGroupIfApplic(req.query)

  validator(req.query).isObject(obj => {
    obj('offset').isNumber().integer().isPositive()
    obj('page').isNumber().integer().notNegative()
  })

  let errors = parseValidatorOutput(validator.run())
  if(errors.length != 0) {
    return res.status(400).finish({
      code: -1,
      messages: errors
    })
  }

  next()
}


module.exports = {
  setResponseFormat,
  apiSection,
  userAuth,
  checkPaginationParams
}
