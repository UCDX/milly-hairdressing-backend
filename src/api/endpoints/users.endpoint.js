const router = require('express').Router()
const userFlows = require('../flows/users.flow');

router.post('/signup', userFlows.signup)
router.post('/login', userFlows.login)
router.post('/create-reservation', userFlows.addReservation)
router.get('/get-user-appointments', userFlows.getUserAppointments)
router.delete('/cancel-reservation', userFlows.deleteReservation)

module.exports = router
