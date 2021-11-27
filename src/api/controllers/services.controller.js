const serviceServices = require('../../services/services.service')

async function addService(req, res) {
  try {
    const serviceStored = await serviceServices.addService(req.body, req.api.user_id)

    if (!serviceStored) {
      return res.status(403).finish({
        code: 1,
        messages: ['Forbidden. User unauthorized.'],
        data: {}
      })
    }

    return res.status(200).finish({
      code: 0,
      messages: ['Done'],
      data: serviceStored
    })
  } catch (err) {
    console.error(err)
    res.status(500).end()
  }
}

async function getAllServices(req, res) {
  try {
    const result = await serviceServices.getAllServices()

    return res.status(200).finish({
      code: 0,
      messages: ['Done'],
      data: result
    })
  } catch (err) {
    console.error(err)
    res.status(500).end()
  }
}

module.exports = {
  addService,
  getAllServices
}
