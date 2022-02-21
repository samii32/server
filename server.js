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
    const { id, pw } = req.body
    // var ciphertext = CryptoJS.AES.encrypt(info.pw, 'secret key 123').toString()
    var crypto_pw = CryptoJS.SHA256(pw).toString()
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query("SELECT * from user where id='"+id+"' and pw='"+crypto_pw+"'", function (error, results, fields) {
        console.log(fields)
        res.send(JSON.stringify(results));
        connection.release();
            if (error) throw error;
      });
    });
});

app.post('/signup', function (req, res) {
    console.log('--------')
    const { id, pw, email } = req.body
    // var crypto_pw = CryptoJS.AES.encrypt(pw, 'secret key 123').toString()
    var crypto_pw = CryptoJS.SHA256(pw).toString()
    // var a ='U2FsdGVkX1+9eDXTnJaoGRsUm6r1v9EIn7z26R3d304='
    // var bytes = CryptoJS.AES.decrypt(a, 'secret key 123');
    pool.getConnection(function (err, connection) {        
        try {
            connection.query("insert into user (id,nm,pw,email) value('" + id + "','" + id + "','" + crypto_pw + "','" + email + "')", function (error, results, fields) {
            res.send(JSON.stringify(results));
            connection.release();
            });
        } catch (error) {
                console.log(error)
        }
    });
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

app.post('/searchUser', function (req, res) {
    const { id } = req.body
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        try {
            console.log('++'+id)
            connection.query("SELECT * from user where id='" + id + "'", function (error, results, fields) {
                console.log(fields)
                res.send(JSON.stringify(results));
                connection.release();
                if (error) throw error;
            });
        }catch (error) {
            console.log(error)
        }
    });
});

app.post('/addFriend', function (req, res) {
    const { me, friend } = req.body
    console.log(me, friend)
    pool.getConnection(function (err, connection) {
        try {
            connection.query("insert into friend (user_no,friend_no) value('"+me+"','"+friend+"')", function (error, results, fields) {
                console.log(results)
                if (results) {
                    res.send({stat:'OK'});    
                } else {
                    res.send({stat:'Fail'});    
                }
                
                connection.release();
            });
        }catch (error) {
            console.log(error)
        }
    });
});