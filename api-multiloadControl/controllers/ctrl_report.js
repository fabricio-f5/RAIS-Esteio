const model_reportKeyHolder = require('../model/reportMultiloadControl/model_reportMultiloadControl')
const msgs = require('../commons/allMessages')

exports.reportMultiloadControl = (req,res) => {

    if (req.body) {
        model_reportKeyHolder.reportMultiloadControl(req.body,req.params.purgeDaysPeriod,function(obj) {
            res.status(obj.status).send(obj)
        })
    }else {
        res.status(400).send({msg: msgs.emptyBody})  
    } 

}