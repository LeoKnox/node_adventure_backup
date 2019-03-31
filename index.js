const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const path = require('path')

app.use(express.static(path.join(__dirname, './static')))
app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.redirect('/main')
})

app.get('/main', (req, res) => {
    res.render('index')
})

app.listen(8000, function() {
    console.log('Listening on port 8000')
})