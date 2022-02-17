const express = require('express');
const app = express()
const cors = require('cors') // 어떤 url이든지 받을수있게 설정

app.use(cors());
app.use(express.json()) //  axios에서 req 값받기위해

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

app.post('/login', function (req, res) {
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


app.post('/signup', function (req, res) {
    console.log('+++++++++++++++++++++++++++++++++++++++')
        
        console.log(req.body)
    console.log('+++++++++++++++++++++')
    
    // pool.getConnection(function (err, connection) {
    //     if (err) throw err;
    //     console.log('+++++++++++++++++++++++++++++++++++++++')
    //     const {id, pw, pw2} = req.body
    //     console.log(id, pw, pw2)
    //     console.log('+++++++++++++++++++++')
        // connection.query("insert into user (id,nm,pw,email) value('hi1','테스트','1111','sam@naver.com')", function (error, results, fields) {
        //     console.log(results)
        //     res.send(JSON.stringify(results));
        //     connection.release();        
        //     if (error) throw error;
        // });
   // });
});
