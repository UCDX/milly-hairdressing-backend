const router = require('express').Router()
const reservationFlows = require('../flows/reservations.flow');

router.get('/blocked-time/:date', reservationFlows.getBlockedTime)
router.get('/by-day/:date', reservationFlows.reservationsByDate)
router.delete('/cancel-reservation', reservationFlows.deleteReservation)
router.get('/get-specific-reservation/:reservation_id', reservationFlows.getSpecificReservation)

module.exports = router
