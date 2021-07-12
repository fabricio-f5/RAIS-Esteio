const db_errors = require('../../commons/db_errors')
const operational_log = require('../../commons/operational_log')
const allMessages  = require('../../commons/allMessages')

function checkFieldInAction(result,monitorBay) {
    return new Promise((resolve,reject)=> { 
            
            if (!monitorBay.at)  {
                result.msg= allMessages.atRequired
                return(reject(result))
            } 

            if (!monitorBay.bayNumber)  {
                result.msg= allMessages.bayNumberRequired
                return(reject(result))
            } 

            return(resolve(result))   
    })
}

const applyRules = function(result,monitorBay)  {

    return  Promise.all([
        checkFieldInAction(result,monitorBay)
   ])
    
}

module.exports = applyRules
    



