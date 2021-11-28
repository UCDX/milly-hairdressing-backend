const reservationsMidd = require('../../middlewares/reservations.middleware')
const reservationsCtrl = require('../controllers/reservations.controller')

module.exports = {
  getBlockedTime: [
    reservationsMidd.checkDate,
    reservationsCtrl.getBlockedTime 
  ]
}
