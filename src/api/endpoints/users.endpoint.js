const router = require('express').Router()
const userFlows = require('../flows/users.flow');

router.post('/signup', userFlows.signup)
router.post('/login', userFlows.login)

module.exports = router
