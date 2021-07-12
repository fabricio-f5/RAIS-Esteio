//const allMessages  = require('../../commons/allMessages')
const moment = require('moment')

function applyRules(result,filter) {
    return new Promise((resolve,reject)=> { 

            let initialDate = moment(filter.initialDate)
            let finalDate = moment(filter.finalDate)
            
            if (!initialDate.isValid()) { 
                result.msg= 'Data inicial Invalida.'
                return(reject(result))
            }

            if (!finalDate.isValid()) { 
                result.msg= 'Data final Invalida.'
                return(reject(result))
            }

            return (resolve(result))
    })
}
module.exports = applyRules
    



