const crypto  = require('crypto')
const secret = require('../config/secret')


function encrypt(text){
  var cipher = crypto.createCipheriv('aes-256-cbc',  new Buffer.from(secret), new Buffer.from('webapplicationcr'))
  var crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}
function decrypt(text){
  var decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer.from(secret), new Buffer.from('webapplicationcr'))
  var dec = decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8')
  return dec
}

module.exports = {encrypt,decrypt}