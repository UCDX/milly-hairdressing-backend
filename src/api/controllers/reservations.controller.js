const reservationService = require('../../services/reservation.service')
const userService = require('../../services/user.service')

async function getBlockedTime(req, res) {
  try {
    const reservations = await reservationService.getReservations(req.body.date)

    // Delete not neccesarry data
    reservations.forEach((obj) => {
      delete obj.id_reservation
      delete obj.user_id
      delete obj.firstname
      delete obj.lastname
      delete obj.reservation_date
      delete obj.service_id
      delete obj.service_name
      delete obj.cost
      delete obj.service_description
      delete obj.service_short_desc
      delete obj.service_duration
      delete obj.is_service_active
    })

    return res.status(200).finish({
      code: 0,
      messages: ['Done'],
      data: {
        reservations: reservations || []
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).end()
  }
}

async function reservationsByDate(req, res) {
  try {
    const isAdminUser = await userService.isAdminUser(req.api.user_id)

    if (!isAdminUser) {
      return res.status(403).finish({
        code: 1,
        messages: ['Forbidden. User unauthorized'],
        data: {}
      })
    }

    const reservations = await reservationService.getReservations(req.body.date)

    return res.status(200).finish({
      code: 0,
      messages: ['Done'],
      data: {
        reservations: reservations || []
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).end()
  }
}

async function deleteReservation(req, res) {
  try {
    const isAdminUser = await userService.isAdminUser(req.api.user_id)
    const isHairdresserUser = await userService.isHairdresserUser(req.api.user_id)
    const isUserOwner = await userService.isUserOwner(req.api.user_id,req.body.reservation_id)
    
    if(!isAdminUser && !isHairdresserUser && !isUserOwner){
      return res.status(403).finish({
        code: 1,
        messages: ['Forbidden. User unauthorized'],
        data: {}
      })
    }
    const cancelResult = await reservationService.deleteReservation(  
      req.body.reservation_id
    )
    if(!cancelResult){
      return res.status(400).finish({
        code: 2,
        messages: ['The day is already passed or is today'],
        data: {}
      })
    }
    return res.status(200).finish({
      code: 0,
      messages: ['Done'],
      data: {
        reservation_id: req.body.reservation_id
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).end()
  }
}

module.exports = {
  getBlockedTime,
  reservationsByDate,
  deleteReservation
}
