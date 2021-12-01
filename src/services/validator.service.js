const Validator = require('better-validator')

function parseValidatorOutput(result) {
  let errors = []

  for (let row of result) {
    let msg = `In [${row.path.join(' -> ')}]: Failed rule [${row.failed}] with value [${row.value}]`
    errors.push(msg)
  }
  
  return errors
}

function parseNumberIfApplicable(val, toFloat = true) {
  if (!isNaN(val)) {
    return (toFloat ? parseFloat(val) : parseInt(val))
  }
  return val
}

function parseJSONIfApplicable(json) {
  try {
    return JSON.parse(json)
  } catch(err) {
    return json
  }
}

function parseNumberFromGroupIfApplic(data) {
  if(data instanceof Array) {
    for(let i = 0; i < data.length; i++) {
      data[i] = parseNumberIfApplicable(data[i])
    }
  } else if(data instanceof Object) {
    for(let key in data) {
      data[key] = parseNumberIfApplicable(data[key])
    }
  }

  return data
}

module.exports = {
  Validator,
  parseValidatorOutput,
  parseNumberIfApplicable,
  parseJSONIfApplicable,
  parseNumberFromGroupIfApplic
}
