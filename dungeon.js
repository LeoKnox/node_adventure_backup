const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/', (err) => {
    console.log("Connected to db")
    if (err) {
        console.log(err)
    }
})

const doorSchema = new mongoose.Schema ({
    location: Number,
    wall: String,
    destination: String    
})

const roomSchema = new mongoose.Schema ({
    name: String,
    height: Number,
    width: Number,
    doors: [doorSchema]
})

module.exports = { Dungeon: mongoose.model('Dungeon', roomSchema), 
    Doors:mongoose.model('Door', doorSchema)}