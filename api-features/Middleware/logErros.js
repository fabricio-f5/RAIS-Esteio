/* Middleware para realização dos Logs de Erros caso ocorram nas operações da Api */
const genericLogger = require('../commons/generalLog')

function logErros (err,req, res, next) {
  genericLogger.info(req.method + '-' + req.originalUrl + ': ' + err.stack)
  res.status(500).send('Erro ao executar : ' +  '[' + req.method + ']-' + req.originalUrl + '.Verifique o arquivo de log pra mais detalhes.')
  next()
}

module.exports = logErros



