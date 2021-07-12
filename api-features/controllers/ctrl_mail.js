const nodemail = require('../commons/nodemail')
const msgs = require('../commons/allMessages')

exports.sendMail = (req,res) => {

        if (req.body) {
                nodemail(req.body.email,req.body.nome,req.body.mensagem,req.body.anexo)
                .then((obj)=> {
                    res.status(obj.status).send(obj)
                })
                .catch((obj)=> {
                    res.status(obj.status).send(obj)
                })
        }else {
            res.status(400).send({msg: msgs.emptyBody})  
        } 

}
