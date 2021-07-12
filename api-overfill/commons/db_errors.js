
exports.errorHandling = (err) => { 
    
    let code = ''
    if (err != undefined ) {
        code = err.code 
    }

    switch (code) {
        case 'ECONNREFUSED': 
            return 'Erro ao tentar realizar a conexão com o banco de dados.'
        case 'ER_ACCESS_DENIED_ERROR':
            return 'Acesso negado ao tentar realizar login no banco de dados.' 
        default: 
            return err.sqlMessage === undefined ? err.message : err.sqlMessage
    }
}
