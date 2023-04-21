const mongoose = require('mongoose')

class Financas {
    constructor(body) {
        this.body = body,
        this.errors = [],
        this.user = null,
        this.projectIndex = 0
    }
    async registerFinancas() {
        await this.verify()
        if (this.errors.length > 0) return this.errors

        const financeData = await this.readFinancas()
        const mongooseDb = mongoose.connection.db.collection('react-apps')

        const currentRegister = {
            tipo: this.body.tipo,
            id: this.body.id,
            valor: this.body.valor,
            data: this.body.data
        }

        financeData.unshift(currentRegister)

        await mongooseDb.findOneAndUpdate({email: this.body.user}, {
            $set: {
                "financas": financeData
            }
        })

        return this.errors
    }
    async readFinancas() {
        const mongooseDb = mongoose.connection.db.collection("react-apps")
        const financasData = []
        let user = ''
        if (this.body.user === undefined) {
            user = Object.keys(this.body)[0]
        } else {
            user = this.body.user
        }

        await mongooseDb.find({email: user}).forEach(user => {
            if (user.financas) {
                financasData.push(...user.financas)
            }
        })
        return financasData
    }
    async delete(id) {
        const financeData = await this.readFinancas()
        const mongooseDb = mongoose.connection.db.collection('react-apps')

        financeData.splice(id, 1)

        await mongooseDb.findOneAndUpdate({email: this.body.user}, {
            $set: {
                "financas": financeData
            }
        })

        return financeData
    }
    async verify() {
        if (this.body.tipo !== "Entrada" && this.body.tipo !== "Saida") return this.errors.push("Selecione um tipo de movimentação válido.")
        if (this.body.id.length == 0) return this.errors.push("Você precisa identificar a movimentação.")
        if (parseInt(this.body.valor) <= 0 || this.body.valor.length == 0) return this.errors.push("Insira um valor maior e diferente de 0")
        if (this.body.data.length != 10) return this.errors.push("Insira a data na qual a movimentação foi feita")
    }
    
}

module.exports = Financas