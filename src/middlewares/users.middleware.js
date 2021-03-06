const { 
  Validator, 
  parseValidatorOutput,
  parseNumberIfApplicable,
  parseNumberFromGroupIfApplic,
} = require('../services/validator.service')

function checkSignupData(req, res, next) {
  req.body.user_type_id = parseNumberIfApplicable(req.body.user_type_id, toFloat = false)

  let validator = new Validator()
  validator(req.body).required().isObject(obj => {
    // admin: 1, hairdresser: 2, customer: 3
    obj('user_type_id').required().isNumber().integer().isIncludedInArray([1, 2, 3])
    obj('firstname').required().isString().lengthInRange(1, 64)
    obj('lastname').required().isString().lengthInRange(1, 64)
    obj('email').required().isString().isEmail().lengthInRange(1, 100)
    obj('phone_number').isString().lengthInRange(1, 15).isMatch(/^[0-9]+$/)
    obj('passwd').required().isString().lengthInRange(1, 255)
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

function checkLoginData(req, res, next) {
  let validator = new Validator()
  validator(req.body).required().isObject(obj => {
    obj('email').required().isString().isEmail().lengthInRange(1, 100)
    obj('passwd').required().isString().lengthInRange(1, 255)
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

function checkNewReservation(req, res, next) {

  let validator = new Validator()
  validator(parseNumberFromGroupIfApplic(req.body)).required().isObject(obj => {
    obj('service_id').required().isNumber().integer()
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
  checkSignupData,
  checkLoginData,
  checkNewReservation
}
