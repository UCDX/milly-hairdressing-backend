const usersMidd = require('../../middlewares/users.middleware')
const usersCtrl = require('../controllers/users.controller')

module.exports = {
  signup: [
    usersMidd.checkSignupData,
    usersCtrl.signup 
  ]
}
