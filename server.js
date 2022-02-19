const express = require('express');
const app = express()
const cors = require('cors') // 어떤 url이든지 받을수있게 설정

var CryptoJS = require('crypto-js')

const mailer = require('./mail')
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
    var info = req.body
    console.log(info)
    var ciphertext = CryptoJS.AES.encrypt(info.pw, 'secret key 123').toString()
    console.log(ciphertext)

    // pool.getConnection(function (err, connection) {
    //     if (err) throw err;

    //     connection.query('SELECT * from user', function (error, results, fields) {
    //         console.log(fields)
    //         res.send(JSON.stringify(results));
    //         connection.release();
        
    //         if (error) throw error;
    //     });
    // });
});


app.post('/signup', function (req, res) {
    console.log('+++++++++++++++++++++++++++++++++++++++')
    const {id, pw, email} = req.body    
    console.log(req.body)
    console.log(id,pw, email)
    var ciphertext = CryptoJS.AES.encrypt(pw, 'secret key 123').toString()
    console.log(ciphertext)
    // var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
    // var originalText = bytes.toString(CryptoJS.enc.Utf8)
    // console.log(originalText)
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

app.post('/send_email', function (req, res) {
    //const email =req.body
    const randNum = parseInt(Math.random()*1000000);
    console.log(randNum)
    const param = req.body;
    let emailParam = {
        toEmail: param.email,
        subject: 'cheese talk 회원가입 인증번호',
        text: '인증번호:' + randNum
    }
    res.json({no:randNum})
    mailer.sendMyEmail(emailParam)
});