const app = require('./app')

app.listen(process.env.PORT, () => {
  console.log('--------------------------------------------')
  console.log(`Server running on port ${process.env.PORT}`)
  console.log('--------------------------------------------')
})
