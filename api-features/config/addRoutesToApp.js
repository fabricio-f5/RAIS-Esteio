const main_route = require('../routes/main_route')
const user_route = require('../routes/user_route')
const mail_route = require('../routes/mail_route')
const access_route = require('../routes/access_route')
const configParameter_route = require('../routes/configParameter_route')
const profile_route = require('../routes/profile_route')
const routePermission_route = require('../routes/routePermission_route')
const permission_route = require('../routes/permission_route')
const keyHolder_route = require('../routes/keyHolder_route')
const avaliableKey_route = require('../routes/avaliableKey_route')
const report_route = require('../routes/report_route')

function addRoutesToApp(app) { 
    app.use(
        main_route,
        user_route,
        mail_route,
        access_route,
        configParameter_route,
        profile_route,
        routePermission_route,
        permission_route,
        keyHolder_route,
        avaliableKey_route,
        report_route
    )
}

module.exports = addRoutesToApp