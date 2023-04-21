const Register = require('../models/registerModel')

exports.loginPost = async (req, res) => {
    try {
        const login = new Register(req.body)
        await login.login()

        if (login.errors.length > 0) {
            return res.send(login.errors)
        }

        return res.send(login.user)
    } catch(e) {
        res.render('404')
        console.log(e)
    }
}