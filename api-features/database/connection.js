
const envVar = require('../config/envConfig')

var knex = require('knex')({
    client:  'mysql2',
    connection: {
        host : envVar.envDbHost,
        user : envVar.envDbUser,
        password : envVar.envDbPass,
        database : envVar.envDbName   
    },
    pool: { min: 0, max: 50 }
});

module.exports = knex


