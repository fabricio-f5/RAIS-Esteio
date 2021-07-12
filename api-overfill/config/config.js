const express = require('express')
const cors = require('cors')
const addRoutesToApp = require('../config/addRoutesToApp')
const logErros =  require('../Middleware/logErros')
const morgan = require('morgan')
const http = require('http')
const app = express()
const envVar = require('./envConfig')
const port = envVar.envPort
const hostname = envVar.envHost

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())
app.use(morgan('combined'))
addRoutesToApp(app)
app.use(logErros)

const server = http.createServer(app)

server.listen(port,hostname, ()=> {
    console.log(`listing - http://${envVar.envHost}:${port}`)
})



module.exports = app






