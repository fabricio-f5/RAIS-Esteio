const model_reportKeyHolder = require('../model/reportOverfill/model_reportOverfill')
const msgs = require('../commons/allMessages')

exports.reportOverfill = (req,res) => {

    if (req.body) {
        model_reportKeyHolder.reportOverfill(req.body,req.params.purgeDaysPeriod,function(obj) {
            res.status(obj.status).send(obj)
        })
    }else {
        res.status(400).send({msg: msgs.emptyBody})  
    } 

}