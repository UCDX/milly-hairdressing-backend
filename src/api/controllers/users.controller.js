const cryptService = require('../../services/crypt.service')
const userService = require('../../services/user.service')

async function signup(req, res) {
  req.body.passwd = cryptService.hash(req.body.passwd)
  try {
    const userId = await userService.signup(req.body)

    if (!userId) {
      return res.status(400).finish({
        code: 1,
        messages: ['Email already registered'],
        data: {}
      })
    }

    const userInformation = await userService.userInformation(userId)
    const token = cryptService.generateJWT({user_id: userId})

    return res.status(200).finish({
      code: 0,
      messages: ['Done'],
      data: {
        ...userInformation,
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
      return res.status(401).finish({
        code: 1,
        messages: ['Invalid credentials'],
        data: {}
      })
    }

    const userInformation = await userService.userInformation(userId)
    const token = cryptService.generateJWT({user_id: userId})

    res.status(200).finish({
      code: 0,
      messages: ['Done'],
      data: {
        ...userInformation,
        session_token: token
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).end()
  }
}

async function addReservation(req, res) {
  try {
    const reservation = await userService.addReservation(
      req.api.user_id,
      req.body.service_id,
      req.body.reservation_date,
      req.body.start_time
    )
    if(!reservation){
      return res.status(400).finish({
        code: 1,
        messages: ['Schedule conflict'],
        data: {}
      })
    }
    return res.status(200).finish({
      code: 0,
      messages: ['Done'],
      data: reservation
    })
  } catch (err) {
    console.error(err)
    res.status(500).end()
  }
}

async function getUserApp(req, res) {
  try {
    const reservations = await userService.getUserApp(
      req.api.user_id,
      req.query.offset,
      req.query.page
    )
    return res.status(200).finish({
      code: 0,
      messages: ['Done'],
      data:reservations 
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
    const cancelResult = await userService.deleteReservation(  
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
  signup,
  login,
  addReservation,
  getUserApp,
  deleteReservation
}
