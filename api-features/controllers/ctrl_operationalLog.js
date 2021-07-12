const model = require('../model/OperationLog/model_operationaLog')
const msgs = require('../commons/allMessages')


exports.reportOperationalLog = (req,res) => {

        if (req.body) {
            model.reportOperationalLog(req.body, function(obj) {
                res.status(obj.status).send(obj)
            })
        }else {
            res.status(404).send({msg: msgs.emptyBody})  
        } 
  
}
