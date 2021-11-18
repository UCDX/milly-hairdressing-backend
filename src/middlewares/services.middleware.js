const { 
  Validator, 
  parseValidatorOutput,
  parseNumberIfApplicable
} = require('../services/validator.service')

function checkNewServiceData(req, res, next) {
  req.body.cost = parseNumberIfApplicable(req.body.cost)
  req.body.service_duration = parseNumberIfApplicable(req.body.service_duration)

  let validator = new Validator()
  validator(req.body).required().isObject(obj => {
    obj('service_name').required().isString().lengthInRange(1, 100)
    obj('cost').required().isNumber()
    obj('service_description').required().isString()
    obj('short_description').required().isString().lengthInRange(1, 100)
    obj('service_duration').required().isNumber().integer().isPositive()
  })

  const errors = parseValidatorOutput(validator.run());
  if (errors.length > 0) {
    return res.status(400).json({ messages: errors })
  }

  next()
}

module.exports = {
  checkNewServiceData
}
