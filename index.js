const http = require('http');
const path = require('path');
const express = require('express');
const app = express();

const hostname = '127.0.0.1';
const port = 3000;

app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, './static')));
app.set('view engine', 'ejs');

/*const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(index);
});*/

app.get('/', function (req, res) {
    res.render('index');
})

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}":${port}/`);
})