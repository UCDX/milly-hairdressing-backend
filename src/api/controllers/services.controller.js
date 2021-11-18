const serviceServices = require('../../services/services.service')

async function addService(req, res) {
  try {
    const serviceStored = await serviceServices.addService(req.body, req.api.user_id)

    if (!serviceStored) {
      return res.status(403).json({
        code: 1,
        messages: ['Forbidden. User unauthorized.'],
        data: {}
      })
    }

    return res.status(200).json({
      code: 0,
      messages: ['Done'],
      data: serviceStored
    })
  } catch (err) {
    console.error(err)
    res.status(500).end()
  }
}

module.exports = {
  addService
}
