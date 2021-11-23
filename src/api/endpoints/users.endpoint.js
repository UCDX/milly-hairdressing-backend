const router = require('express').Router()
const userFlows = require('../flows/users.flow');

router.post('/signup', userFlows.signup)
router.post('/login', userFlows.login)
router.post('/create-reservation', userFlows.addReservation)

module.exports = router
