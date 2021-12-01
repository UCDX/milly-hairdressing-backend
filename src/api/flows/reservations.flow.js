const reservationsMidd = require('../../middlewares/reservations.middleware')
const generalMidd = require('../../middlewares/general.middleware')
const reservationsCtrl = require('../controllers/reservations.controller')

module.exports = {
  getBlockedTime: [
    reservationsMidd.checkDate,
    reservationsCtrl.getBlockedTime 
  ],

  reservationsByDate: [
    generalMidd.userAuth,
    reservationsMidd.checkDate,
    reservationsCtrl.reservationsByDate 
  ]
}
