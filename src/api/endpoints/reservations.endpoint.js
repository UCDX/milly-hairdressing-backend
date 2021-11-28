const router = require('express').Router()
const reservationFlows = require('../flows/reservations.flow');

router.get('/blocked-time', reservationFlows.getBlockedTime)

module.exports = router
