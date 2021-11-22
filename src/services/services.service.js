const mariadb = require('./mariadb.service')

/**
 * Add a new service that offers the hairdressing salon in the DB.
 * Only admin users can add a service.
 * @param {*} serviceData An object with:
 * - service_name: string.
 * - cost: float.
 * - service_description: string.
 * - short_description: string.
 * - service_duration: int
 */
async function addService(serviceData, userId) {
  const q = `
    SELECT user_types.type_code
    FROM users
    INNER JOIN user_types
    ON users.user_type_id = user_types.id
    WHERE users.id = ?;
  `

  const userInfoResult = await mariadb.query(q, [userId])
  // It is validated that only admin users can add a service.
  if (userInfoResult[0].type_code !== 'admin') {
    return null
  }

  const query = `
    INSERT INTO services (
      service_name,
      cost,
      service_description,
      short_description,
      service_duration
    )
    VALUES (?, ?, ?, ?, ?); 
  `

  const { service_name, cost, service_description, short_description, service_duration } = serviceData
  let arguments = [service_name, cost, service_description, short_description, service_duration]
  
  const result = await mariadb.query(query, arguments)

  return {
    id: result.insertId,
    ...serviceData,
    is_active: 1 // Default value.
  }
}

/**
 * Return all the hairdressing salon services registered in the DB.
 * @returns {Object}
 *  - total_records: number
 *  - services: array of objects. Services records
 */
async function getAllServices() {
  const servicesQuery = `SELECT * FROM services;`
  const servicesResult = await mariadb.query(servicesQuery)

  const countQuery = `SELECT COUNT(*) AS total_records FROM services;`
  let countResult = await mariadb.query(countQuery)
  countResult = countResult[0]

  return {
    total_records: countResult ? countResult.total_records : 0,
    services: servicesResult
  }
}

module.exports = {
  addService,
  getAllServices
}
