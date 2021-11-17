const router = require('express').Router()
const userEndpoints = require('./endpoints/users.endpoint')
const serviceEndpoints = require('./endpoints/services.endpoint')

router.use('/users', userEndpoints)
router.use('/services', serviceEndpoints)

module.exports = router
