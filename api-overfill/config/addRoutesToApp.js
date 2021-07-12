const main_route = require('../routes/main_route')
const truck_route = require('../routes/truck_route')
const monitorBay_route = require('../routes/monitorBay_route')
const report_route = require('../routes/report_route')


function addRoutesToApp(app) { 
    app.use(
        main_route,
        truck_route,
        monitorBay_route,
        report_route
    )
}

module.exports = addRoutesToApp