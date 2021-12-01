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

async function deleteReservation(reservation_id) {


  const reservationDateQuery = "SELECT reservation_date FROM reservations WHERE id = ?;"
  const reservationDateResult = await mariadb.query(reservationDateQuery,[reservation_id])

  //Get date of reservation
  const reservationDate = (reservationDateResult[0].reservation_date).toString()
  const DateString = (new Date(reservationDate).toISOString())
  const finalReservationDate = DateString.slice(0,10)


  // Get date of today
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; 
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }

  if (mm < 10) {
    mm = '0' + mm;
  }

  todaysDate =  yyyy + '-' + mm + '-' + dd;

  //Check if the date isn't already passed
  if(todaysDate > finalReservationDate){
    return null
  }

  const query = "DELETE FROM reservations WHERE id= ? ";
  const result = await mariadb.query(query, [reservation_id])

  return result
}

async function specificReservation(reservation_id) {
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
    WHERE reservations.id = ?
  `
  const result = await mariadb.query(query, [reservation_id])

  return result
}

module.exports = {
  getReservations,
  deleteReservation,
  specificReservation
}
