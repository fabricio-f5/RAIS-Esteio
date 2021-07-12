const mailer = require("nodemailer")
const jsonResponse = require('../../commons/DialogReactAndApi')
const msgs = require('../../commons/allMessages')
const envVar = require('../../config/envConfig')
 
module.exports = (email, user,key,keyHolder) => {
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
    
    const subjectMsg = `Sistema Claviculário - Você tem uma nova mensagem`
    
    const mail = {
        from: `Claviculário ${envVar.envMail}`,
        to: email,
        subject: subjectMsg,
        //text: mensagem,
        html: `<div>
                    <p style='margin-left:20px'><b>Atenção</b>, Usuário <b>${user}</b> retirou a(s) chave(s) de número: <b>${key}</b> do claviculário <b>${keyHolder}</b> sem permissão.</b></p>
                    <p style='margin-left:20px'>Esta operação também foi registrada no relatório para análise futura e comprobatória.</b></p>
               </div>`
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