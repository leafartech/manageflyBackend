const Register = require('../models/registerModel')

exports.registerGet = async (req, res) => {
    try {
        const register = new Register()
    
        const list = await register.readUsers()
        res.json(list)
    }catch(e) { console.log(e) }
}

exports.registerPost = async (req, res) => {
    try {
        const register = new Register(req.body)
    
        await register.register()
    
        if (register.errors.length > 0) {
            return res.send({errors: register.errors})
        } else {
            return res.send(register.user)
        }
    }catch(e) { console.log(e) }
}