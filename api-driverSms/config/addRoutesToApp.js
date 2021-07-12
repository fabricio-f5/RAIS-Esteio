const main_route = require('../routes/main_route')
const driverSms_route = require('../routes/driverSms_route')

function addRoutesToApp(app) { 
    app.use(
        main_route,
        driverSms_route
    )
}

module.exports = addRoutesToApp