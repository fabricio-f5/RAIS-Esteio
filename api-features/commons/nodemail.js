const mailer = require("nodemailer")
const jsonResponse = require('./DialogReactAndApi')
const msgs = require('../commons/allMessages')
const envVar = require('../config/envConfig')
 
module.exports = (email, nome, mensagem, anexo) => {
    let result = jsonResponse()
  
    const smtpTransport = mailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, 
        auth: {
            user: envVar.envMail,
            pass: envVar.envPwdMail
        }
    })
    
    const subjectMsg = nome !== undefined ?  `${nome} Confirmação de cadastro no sistema WebApp` : 'Procedimento para Troca de Senha.'
    
    const mail = {
        from: "WebApp <atfxxx01@gmail.com>",
        to: email,
        subject: subjectMsg,
        //text: mensagem,
        html: `<div><p>Prezado <b>${nome !== undefined ? nome :'Cliente'}</b>,</p>
                    <p style='margin-left:20px'>${mensagem}</p>
               </div>`
    }
    
    if(anexo){
        console.log(anexo)
        mail.attachments = []
        mail.attachments.push({
            filename: anexo.originalname,
            content: anexo.buffer
        })
    }
    
    return new Promise((resolve, reject) => {
        smtpTransport.sendMail(mail)
            .then(() => {
                smtpTransport.close()
                result.msg = msgs.emailSend 
                result.status=200

                return resolve(result)
            })
            .catch((error) => {
                smtpTransport.close()
                result.errStack = error
                result.msg = msgs.emailNotSend
                result.status=500
                return reject(result)
            })
    })
}