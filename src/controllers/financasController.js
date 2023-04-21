const Financas = require('../models/financasModel')

exports.financasRegister = async (req, res) => {
    try {
        const financas = new Financas(req.body)

        const verify = await financas.registerFinancas()

        return res.send(verify)
    }catch(e) {
        console.log(e)
    }
}

exports.financasRead = async (req, res) => {
    try {
        const financas = new Financas(req.body)

        const financeData = await financas.readFinancas()

        return res.send(financeData)
    }catch(e) {
        console.log(e)
    }
}
exports.financasExclude = async (req, res) => {
    try {
        const financas = new Financas(req.body)
        const id = req.body.id

        const financeUpdated = await financas.delete(id)

        return res.send(financeUpdated)
    }catch(e) {
        console.log(e)
    }
}