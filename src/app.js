// Loading environment variables.
const path =  require('path')
let envpath = path.join(__dirname, '..', 'etc', '.env')
let result = require('dotenv').config({ path: envpath })
if (result.error) {
  console.error(".env file not found")
  console.error(result.error.message)
  process.exit(1)
}

// Including dependencies.
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const general = require('./middlewares/general')

const app = express()

// Middlewares.
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(general.apiSection)
app.use(morgan('dev'))
app.use('/api', require('./api/interfaces'))

module.exports = app
