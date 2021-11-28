const usersMidd = require('../../middlewares/users.middleware')
const usersCtrl = require('../controllers/users.controller')
const generalMidd = require('../../middlewares/general.middleware')

module.exports = {
  signup: [
    usersMidd.checkSignupData,
    usersCtrl.signup 
  ],
  login: [
    usersMidd.checkLoginData,
    usersCtrl.login
  ],

  addReservation: [
    generalMidd.userAuth,
    usersMidd.checkNewReservation,
    usersCtrl.addReservation
  ],

  getUserAppointments: [
     generalMidd.userAuth,
     generalMidd.checkPaginationParams,
     usersCtrl.getUserApp
    
  ]
}
