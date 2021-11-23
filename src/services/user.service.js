const mariadb = require('./mariadb.service')

/**
 * Creates a new user user in the system.
 * @param {*} user An object with:
 * - user_type_id: int.
 * - firstname: string.
 * - lastname: string.
 * - email: string.
 * - phone_number: string. Optional.
 * - passwd: string.
 */
async function signup(user) {
  const q = `
    SELECT email FROM users
    WHERE email = ? 
    LIMIT 1;
  `
  const result = await mariadb.query(q, [user.email])
  // Email already exists.
  if (result[0]) {
    return null
  }

  const query = `
    INSERT INTO users (user_type_id, firstname, lastname, email, phone_number, passwd, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?); 
  `

  let arguments = [
    user.user_type_id,
    user.firstname,
    user.lastname,
    user.email,
    user.phone_number || '',
    user.passwd,
    1 // is active
  ]
  
  const signupResult = await mariadb.query(query, arguments)

  return {
    id: signupResult.insertId,
    user_type_id: user.user_type_id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phone_number: user.phone_number,
    passwd: user.passwd,
    is_active: 1
  }
}

/**
 * Gets the user id only if the email exists and the password is correct.
 * @param {string} email 
 * @param {string} password 
 * @returns {number | null}
 */
async function login(email, password) {
  const query = `
    SELECT id
    FROM users
    WHERE email = ? AND passwd = ?
    LIMIT 1;
  `
  const result = await mariadb.query(query, [email, password])

  return (!result[0] ? null : result[0].id)
}
/**
 * Insert a reservation in a data base
 * @param {int} user_id 
 * @param {int} service_id 
 * @param {string} reservation_date 
 * @param {string} start_time 
 */
async function addReservation(user_id, service_id, reservation_date, start_time) {

  const serviceDurationQuery = "SELECT service_duration FROM services WHERE id = ?;"
  const serviceDurationResult = await mariadb.query(serviceDurationQuery,[service_id])
  const serviceDuration = serviceDurationResult[0].service_duration

  const hourString = start_time.slice(0, 2)
  const endHourInt = parseInt(hourString) + serviceDuration
  let end_time
  if(endHourInt < 10)
    end_time = '0' + String(endHourInt) + ':00:00'
  else
    end_time = String(endHourInt) + ':00:00'

  const reservationsQuery = "SELECT * FROM reservations WHERE reservation_date = ?";
  const reservationResult = await mariadb.query(reservationsQuery,[reservation_date])
  
  for (const reservation of reservationResult) {
    if(start_time < reservation.end_time && end_time > reservation.start_time){
      return null
    }
  }

  const makeReservationQuery = `
    INSERT INTO reservations (
      user_id,
      service_id,
      reservation_date,
      start_time,
      end_time
    )
    VALUES (?, ?, ?, ?, ?); 
  `

  let arguments = [user_id, service_id, reservation_date, start_time, end_time]
  const result = await mariadb.query(makeReservationQuery, arguments)

  return {
    id: result.insertId,
    service_id,
    reservation_date,
    start_time,
    end_time
  }
}

module.exports = {
  signup,
  login,
  addReservation
}
