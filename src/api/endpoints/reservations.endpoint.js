const router = require('express').Router()
const reservationFlows = require('../flows/reservations.flow');

router.get('/blocked-time', reservationFlows.getBlockedTime)
router.get('/by-day', reservationFlows.reservationsByDate)
router.delete('/cancel-reservation', reservationFlows.deleteReservation)
router.get('/get-specific-reservation', reservationFlows.getSpecificReservation)
router.put('/reservation/:reservation_id', reservationFlows.updateReservation)

module.exports = router
