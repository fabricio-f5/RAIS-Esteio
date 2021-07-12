const express = require('express')
const cors = require('cors')
const addRoutesToApp = require('../config/addRoutesToApp')
const logErros =  require('../Middleware/logErros')
const morgan = require('morgan')
const http = require('http')
const app = express()
const envVar = require('./envConfig')
const port = normalizaPort(envVar.envPort) || 4004
const hostname = envVar.envHost

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())
app.use(morgan('combined'))
addRoutesToApp(app)
app.use(logErros)


function normalizaPort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
if (port >= 0) {
        return port;
    }
return false;
}

const server = http.createServer(app)
server.listen(port,hostname, ()=> {
    console.log(`listing - http://${envVar.envHost}:${port}`)
})

module.exports = app






