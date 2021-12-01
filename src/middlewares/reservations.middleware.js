const { 
  Validator, 
  parseValidatorOutput,
  parseNumberIfApplicable,
} = require('../services/validator.service')

function checkDate(req, res, next) {

  let validator = new Validator()
  validator(req.body).required().isObject(obj => {
    obj('date').required().isString().isDate()
  })
      
  const errors = parseValidatorOutput(validator.run());
  if (errors.length > 0) {
    return res.status(400).finish({
      code: -1,
      messages: errors
    })
  }

  next()
}

function checkReservationId(req, res, next) {

  req.body.reservation_id = parseNumberIfApplicable(req.body.reservation_id, toFloat = false)

  let validator = new Validator()
  validator(req.body).required().isObject(obj => {
    obj('reservation_id').required().isNumber().integer()
  })
      
  const errors = parseValidatorOutput(validator.run());
  if (errors.length > 0) {
    return res.status(400).finish({
      code: -1,
      messages: errors
    })
  }

  next()
}

function checkReservationIdReqParam(req, res, next) {

  req.params.reservation_id = parseNumberIfApplicable(req.params.reservation_id, toFloat = false)

  let validator = new Validator()
  validator(req.params).required().isObject(obj => {
    obj('reservation_id').required().isNumber().integer()
  })
      
  const errors = parseValidatorOutput(validator.run());
  if (errors.length > 0) {
    return res.status(400).finish({
      code: -1,
      messages: errors
    })
  }

  next()
}

function checkUpdateParams(req, res, next) {

  let validator = new Validator()
  validator(req.body).required().isObject(obj => {
    obj('reservation_date').required().isString().isDate()
    obj('start_time').required().isString()
  })
      
  const errors = parseValidatorOutput(validator.run());
  if (errors.length > 0) {
    return res.status(400).finish({
      code: -1,
      messages: errors
    })
  }

  next()
}

module.exports = {
  checkDate,
  checkReservationId,
  checkReservationIdReqParam,
  checkUpdateParams
}
