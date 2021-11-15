const router = require('express').Router()
const userFlows = require('../flows/users.flow');

router.post('/signup', userFlows.signup)

module.exports = router
