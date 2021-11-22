const router = require('express').Router()
const serviceFlows = require('../flows/services.flow');

router.post('/add', serviceFlows.addService)
router.get('/get-all', serviceFlows.getAllServices)

module.exports = router
