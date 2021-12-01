const mariadb = require('./mariadb.service')

async function userInformation(userId) {
  const query = `
    SELECT
      users.id,
      users.firstname,
      users.lastname,
      users.email,
      users.phone_number,
      users.is_active,
      users.user_type_id,
      user_types.type_name,
      user_types.type_code
    FROM users
    INNER JOIN user_types
    ON users.user_type_id = user_types.id
    WHERE users.id = ?;
  `

  const result = await mariadb.query(query, [userId])
  return result[0]
}

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

  return signupResult.insertId
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

/**
 * Retrieves all reservations made for a user.
 * @param {int} userId 
 * @param {int} offset
 * @param {int} page 
 * @returns 
 /** */

async function getUserApp(userId, offset = 10, page = 0) {

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
    WHERE users.id = ?
    ORDER BY 
      reservations.reservation_date DESC,
      reservations.start_time DESC
    Limit ?,?;
  `
  const queryN = `SELECT count(*) AS total_records FROM reservations WHERE user_id = ?;`

  const n_results = await mariadb.query(queryN, [userId])
  const result = await mariadb.query(query, [userId, (page*offset), offset])
  
  return {
    reservations: result,
    total_records: n_results[0].total_records
  }

}

/**
 * Validate if user id belongs to a Admin user.
 */
async function isAdminUser(userId) {
  const q = `
    SELECT user_types.type_code
    FROM users
    INNER JOIN user_types
      ON users.user_type_id = user_types.id
    WHERE users.id = ?;
  `

  const userInfoResult = await mariadb.query(q, [userId])
  return (userInfoResult[0].type_code == 'admin')
}

/**
 * Validate if user id belongs to a Admin user.
 */
 async function isHairdresserUser(userId) {
  const q = `
    SELECT user_types.type_code
    FROM users
    INNER JOIN user_types
      ON users.user_type_id = user_types.id
    WHERE users.id = ?;
  `

  const userInfoResult = await mariadb.query(q, [userId])
  return (userInfoResult[0].type_code == 'hairdresser')
}

async function isUserOwner(userId,reservation_id) {

  const Query = "SELECT user_id FROM reservations WHERE id = ?;"
  const Result = await mariadb.query(Query,[reservation_id])
  const idUserReservation = Result[0].user_id
 
  return (idUserReservation == userId)
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



module.exports = {
  signup,
  login,
  addReservation,
  userInformation,
  getUserApp,
  isAdminUser,
  isHairdresserUser,
  deleteReservation,
  isUserOwner
}
