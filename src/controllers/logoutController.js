const Register = require('../models/registerModel')

exports.saveNotifications = async (req, res) => {
    try {
        const register = new Register

        register.saveNotifications(req.body)

        return res.sendStatus(200)
    }catch(e) {
        console.log(e)
    }
}