const main_route = require('../routes/main_route')
const multiloadControl_route = require('../routes/multiloadControl_route')
const report_route = require('../routes/report_route')

function addRoutesToApp(app) { 
    app.use(
        main_route,
        multiloadControl_route,
        report_route
    )
}

module.exports = addRoutesToApp