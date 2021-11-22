const servicesMidd = require('../../middlewares/services.middleware')
const generalMidd = require('../../middlewares/general.middleware')
const servicesCtrl = require('../controllers/services.controller')

module.exports = {
  addService: [
    generalMidd.userAuth,
    servicesMidd.checkNewServiceData,
    servicesCtrl.addService 
  ],

  getAllServices: [
    servicesCtrl.getAllServices
  ]
}
