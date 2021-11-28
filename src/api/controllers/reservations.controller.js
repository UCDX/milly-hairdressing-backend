const reservationService = require('../../services/reservation.service')

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

module.exports = {
  getBlockedTime
}
