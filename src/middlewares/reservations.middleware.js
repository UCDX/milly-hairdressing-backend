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

module.exports = {
  checkDate
}
