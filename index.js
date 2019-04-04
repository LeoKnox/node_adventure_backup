const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session')
const http = require('http').Server(app)
const io = require('socket.io')(http)
const Adventurer = require('./adventurer.js')

const path = require('path')

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, './static')))
app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'ejs')
app.use(session({secret: "be very quiet"}))

io.on('connection', function(socket) {
    socket.on('chat message', function(msg) {
        io.emit('chat message', msg)
    })
})

app.get('/', (req, res) => {
    let stats = { atk: 16, def: 12, hp: 40, mgc: 8 }
    res.render('login', stats)
})

app.post('/login', (req, res) => {
    req.session.user = req.body
    console.log(req.body)
    res.redirect('/main')
})

app.post('/new', (req, res) => {
    let x = new Adventurer(req.session.user)
    console.log(x[req.body.action]())
    res.redirect('/main')
})

app.get('/main', (req, res) => {
    console.log(req.session.user)
    res.render('index', {user: req.session.user})
})

http.listen(3000, function() {
    console.log('listening on port 3000')
})

app.listen(8000, function() {
    console.log('Listening on port 8000')
})