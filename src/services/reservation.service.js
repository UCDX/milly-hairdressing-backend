const mariadb = require('./mariadb.service')

/**
 * Retrieves all reservations for a specific day.
 * @param {string} date 
 */
async function getReservations(date) {
  const query = `
    SELECT 
      reservations.id AS id_reservation,
      users.id AS user_id,
      users.firstname,
      users.lastname,
      reservations.reservation_date,
      reservations.start_time,
      reservations.end_time,
      services.id AS service_id,
      services.service_name,
      services.cost,
      services.service_description,
      services.short_description AS service_short_desc,
      services.service_duration,
      services.is_active AS is_service_active
    FROM reservations
    INNER JOIN users
      ON reservations.user_id = users.id
    INNER JOIN services
      ON reservations.service_id = services.id
    WHERE reservations.reservation_date = ?
    ORDER BY reservations.start_time;
  `

  const result = await mariadb.query(query, [date])
  return result
}

module.exports = {
  getReservations
}
