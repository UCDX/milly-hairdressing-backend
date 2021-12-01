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
  ],

  deleteReservation: [
    generalMidd.userAuth,
    reservationsMidd.checkReservationId,
    reservationsCtrl.deleteReservation
  ],

  getSpecificReservation: [
    generalMidd.userAuth,
    reservationsMidd.checkReservationId,
    reservationsCtrl.specificReservation
  ],

  updateReservation: [
    generalMidd.userAuth,
    reservationsMidd.checkReservationIdReqParam,
    reservationsMidd.checkUpdateParams,
    reservationsCtrl.updateReservation
  ]
}
