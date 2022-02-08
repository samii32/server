const express = require('express');
const app = express()
const cors = require('cors') // 어떤 url이든지 받을수있게 설정

app.use(cors());

const server = app.listen(3000, () => {
    console.log('Start Server: localhost:3000');
});
console.log(server)

app.get('/', function (req, res) {
    res.send('hello world')
});

app.get('/about', function (req, res) {
    res.send('about page')
});

var mysql = require('mysql')
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    port: '3306',
    user: 'sam',
    password: '1111',
    database: 'cheese'
});

app.post('/db', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) throw err;

        connection.query('SELECT * from user', function (error, results, fields) {
            console.log(fields)
            res.send(JSON.stringify(results));
            connection.release();
        
            if (error) throw error;
        });
    });
});
