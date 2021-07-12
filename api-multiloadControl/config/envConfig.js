require('dotenv').config()

const envVar = { 
    envPort: process.env.PORT,
    envHost: process.env.HOST,
    envLog: process.env.LOG,
    envDbHost: process.env.DB_HOST,
    envDbUser: process.env.DB_USER,
    envDbPass: process.env.DB_PASSWORD,
    envDbName: process.env.DB_NAME
}

if(process.env.NODE_ENV == 'production') {
    console.log('Variáveis de Ambiente - Produção Configuradas')
    envVar.envDbUser=process.env.DB_USER_PROD,
    envVar.envDbPass=process.env.DB_PASSWORD_PROD,
    envVar.envDbName=process.env.DB_NAME_PROD,
    envVar.envPort=process.env.PORT_PROD,
    envVar.envHost=process.env.HOST_PROD
}

module.exports = envVar
