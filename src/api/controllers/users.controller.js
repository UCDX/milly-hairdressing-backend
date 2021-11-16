const cryptService = require('../../services/crypt.service')
const userService = require('../../services/user.service')

async function signup(req, res) {
  req.body.passwd = cryptService.hash(req.body.passwd)
  try {
    const result = await userService.signup(req.body)

    if (!result) {
      return res.status(400).json({
        messages: ['Email already exists.']
      })
    }

    const token = cryptService.generateJWT({user_id: result.id})

    return res.status(200).json({
      messages: ['Done'],
      data: {
        id: result.id,
        user_type_id: req.body.user_type_id,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone_number: req.body.phone_number || '',
        is_active: result.is_active,
        session_token: token
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).end()
  }
}

async function login(req, res) {
  try {
    const email = req.body.email
    const passwd = cryptService.hash(req.body.passwd)
          
    const userId = await userService.login(email, passwd)

    if (!userId) {
      return res.status(401).json({messages: ['Invalid credentials']})
    }

    const token = cryptService.generateJWT({user_id: userId})

    res.status(200).json({
      messages: ['Done'],
      data: {
        session_token: token
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).end()
  }
}

module.exports = {
  signup,
  login
}
