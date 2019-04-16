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

    socket.on('take turn', function(newaction) {
        console.log(newaction)
        let msg = {message: "You have moved in a circle"}
        if (newaction.action[0] == 'm') {
            console.log('rollin rollin rollin keep them doggies rollin')
            console.log(newaction.action.slice(1))
        }
        io.emit('move action', msg)
    })

    socket.on('changeclass', function(newclass) {
        let newstats = {name: "", atk:"99", def:"99", hp:"99", mgc:"99", classes:"99"}
        MongoClient.connect(url, function(err, db){
            if (err) {
                console.log(err)
            } else {
                var dbo = db.db("node_adventure")
                dbo.collection("classes").findOne({classes: newclass})
                    .then(newstats => {
                        io.emit('changeclass', newstats)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
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
    console.log(req.body.name)
    res.redirect('/main')
})

app.post('/new', (req, res) => {
    let x = new Adventurer(req.session.user)
    console.log(x[req.body.action]())
    res.redirect('/main')
})

app.get('/main', (req, res) => {
    MongoClient.connect(url, function(err, db){
            if (err) {
                console.log(err)
            } else {
                var dbo = db.db("node_adventure")
                dbo.collection("dungeon").findOne({name: "Begin"})
                    .then(params => {
                        let wallx = (898-params.width*40)/2
                        let wally = (338-params.height*40)/2
                        let doorx = wallx+params.door[0].x*40-7
                        let doory = wally+params.door[0].y*40-12
                        for (let i = 0; i<params.door.length; i++) {
                            params.door[i].x = wallx + params.door[i].x*40-7
                            params.door[i].y = wally + params.door[i].y*40-12
                        }
                        console.log(params.door[0].x)
                        let dungeon = {
                            height: params.height*40,
                            width: params.width*40,
                            wallx: wallx,
                            wally: wally,
                            params: params
                        }
                        res.render('index', {user: req.session.user, dungeon})
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
    })
    //let dungeon = {height: 200, width: 440}
    //res.render('index', {user: req.session.user, dungeon})
})

http.listen(3000, function() {
    console.log('listening on port 3000')
})