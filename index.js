const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session')
const http = require('http').Server(app)
const io = require('socket.io')(http)
const Adventurer = require('./adventurer.js')
const Dungeon = require('./dungeon.js')
const MongoClient = require('mongodb').MongoClient
const url = "mongodb://localhost:27017/"
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

    socket.on('changeclass', function(newclass) {
        console.log(newclass)
        let newstats = {name: "", atk:"99", def:"99", hp:"99", mgc:"99", classes:"99"}
        MongoClient.connect(url, function(err, db){
            if (err) {
                console.log(err)
            } else {
                var dbo = db.db("node_adventure")
                dbo.collection("classes").find({classes: newclass}).toArray(function(err, wstats) {
                    io.emit('changeclass', wstats[0])
                    //res.render('login', {char:stats})
                })
            }
        //io.emit('changeclass', newstats)
        })
    })
})

app.get('/', (req, res) => {
    MongoClient.connect(url, function(err, db){
        if (err) {
            console.log(err)
        } else {
            var dbo = db.db("node_adventure")
            dbo.collection("classes").find({}).toArray(function(err, stats) {
                res.render('login', {char:stats})
            })
        }
    })
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