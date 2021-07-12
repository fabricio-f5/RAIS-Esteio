
function jsonResponse() {
this.msg =""
this.registers =[]
this.status=""
this.errStack=""
this.auth=""
this.token=""
this.bsApproved=true
}

module.exports = () => {
    return new jsonResponse()
}
