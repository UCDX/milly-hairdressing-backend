const router = require('express').Router()
const reservationFlows = require('../flows/reservations.flow');

router.get('/blocked-time', reservationFlows.getBlockedTime)
router.get('/by-day', reservationFlows.reservationsByDate)

module.exports = router
