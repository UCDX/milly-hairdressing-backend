const router = require('express').Router()
const userEndpoints = require('./endpoints/users.endpoint')
const serviceEndpoints = require('./endpoints/services.endpoint')
const reservationEndpoints = require('./endpoints/reservations.endpoint')

router.use('/users', userEndpoints)
router.use('/services', serviceEndpoints)
router.use('/reservations', reservationEndpoints)

module.exports = router
