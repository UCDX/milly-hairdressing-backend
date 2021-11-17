const router = require('express').Router()
const serviceFlows = require('../flows/services.flow');

router.post('/add', serviceFlows.addService)

module.exports = router
