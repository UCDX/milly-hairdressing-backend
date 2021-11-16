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

module.exports = {
  signup
}
