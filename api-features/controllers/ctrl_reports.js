const model_reportKeyHolder = require('../model/ReportKeyHolder/model_reportKeyHolder')
const msgs = require('../commons/allMessages')

exports.reportsKeyHolder = (req,res) => {

    if (req.body) {
        model_reportKeyHolder.reportAvaliableKey(req.body, function(obj) {
            res.status(obj.status).send(obj)
        })
    }else {
        res.status(400).send({msg: msgs.emptyBody})  
    } 

}