const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session')
const http = require('http').Server(app)
const io = require('socket.io')(http)

const path = require('path')

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
    res.redirect('/main')
})

app.get('/main', (req, res) => {
    req.session.user = 'Aelien'
    res.render('index', {user: req.session.user})
})

http.listen(3000, function() {
    console.log('listening on port 3000')
})

app.listen(8000, function() {
    console.log('Listening on port 8000')
})