require('dotenv').config()

const express = require('express')
const app = express()

//DATA BASE CONNECTION
const mongoose = require('mongoose')
mongoose.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Data Bank Connected')
        app.emit('loaded')
    }).catch(e => console.log(e))
mongoose.set('strictQuery', true)

//SESSION & FLASH
const session = require('express-session')
const mongoStore = require('connect-mongo')
const flash = require('connect-flash')

//SESSION
const sessionOpt = session({
    secret: 'dino ssaur!',
    sotre: mongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, //Tempo
        httpOnly: true
    }
})

//CORS
const cors = require('cors')
const corsOptions = {
    origin:'https://managefly-frontend.vercel.app/',
//     origin: 'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.use(sessionOpt)
app.use(flash())

const routes = require('./routes')
const path = require('path')
app.use(express.static(path.resolve(__dirname + '/public')))
app.use(express.urlencoded({ extended: true }))
app.use(routes)

app.set('views', path.resolve(__dirname + '/src/views'))
app.set('view engine', 'ejs')

let port = 5000
app.on('loaded', () => {
    app.listen(port, () => {
        console.log('Server Listen on port', port)
    })
})
