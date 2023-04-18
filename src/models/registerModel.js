const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const validator = require('validator')

const RegisterSchema = {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
}

const RegisterModel = mongoose.model('react-app', RegisterSchema)

class Register {
    constructor(body) {
        this.body = body,
        this.errors = [],
        this.user = null
    }

    async login() {
        if (this.errors.length > 0) return
        this.user = await RegisterModel.findOne({ email: this.body.email })

        if (!this.user) {
            this.errors.push('Ops...Essa conta não existe, verifique se o e-mail está digitado corretamente')
            return
        }

        if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
            this.errors.push(`A senha digitada é inválida.`)
            this.user = null
            return
        }
    }
    async register() {
        this.validate()
        if (this.errors.length > 0) return

        await this.userExists()
        if (this.errors.length > 0) return
        
        const salt = bcryptjs.genSaltSync()
        this.body.password = bcryptjs.hashSync(this.body.password, salt)
        
        this.user = await RegisterModel.create(this.body) //Usuário salvo em this.user para podermos acessar depois

        return this.user
    }
    async readUsers() {
        const mongooseFn = mongoose.connection.db.collection('react-apps')
        const find = mongooseFn.find({}, {})

        let users = []
        await find.forEach(user => {
            users.push(user)
        })

        return users
    }
    async userExists() {
        this.user = await RegisterModel.findOne({ email: this.body.email })
        if (this.user) this.errors.push('Usuário já existe.')
    }
    async saveNotifications(body) {
        const mongooseDb = mongoose.connection.db.collection('react-apps')
        const user = body.user
        const notifications = [body.notifications]
        const notificationsArr = notifications[0].split(',')
        let updatedStrArr = []
        for (let p = 0; p < notificationsArr.length; p++) {
            if (p % 4 === 0) {
                updatedStrArr.push([notificationsArr[p], notificationsArr[p+1], notificationsArr[p+2], notificationsArr[p+3]])
            }
        }
        await mongooseDb.findOneAndUpdate({email: user}, {
            $set: {
                "notifications": updatedStrArr
            }
        })

        return
    }
    validate() {
        this.cleanUp()
        //VALIDAÇão
        if (!(/\s/g.test(this.body.name)) || this.body.name.length < 6) return this.errors.push('Nome inválido.')
        if (!validator.isEmail(this.body.email)) return this.errors.push('E-mail inválido.')
        if (this.body.password.length < 8 || !/[A-Z]/.test(this.body.password)) return this.errors.push('Senha Inválida.')
    }
    cleanUp() {
        //GARANTINDO QUE OS DADOS DO FORM TERÃO SÓ OS ESPAÇOS QUE QUEREMOS
        this.body = {
            name: this.body.name,
            email: this.body.email,
            password: this.body.password
        }
    }
}

module.exports = Register