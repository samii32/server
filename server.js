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
            var query = "insert into friend (user_no,friend_no,FriendYN) value('" + me + "','" + friend + "','Y')"
            connection.query(query, function (error, results, fields) {
                if (error) throw error;
            });

            var query2 = "insert into friend (user_no,friend_no,FriendYN) value('" + friend + "','" + me + "','N')"
            connection.query(query2, function (error, results, fields) {
                if (results) {
                    res.send({stat:'OK'});    
                } else {
                    res.send({stat:'Fail'});    
                }
                connection.release();
                if (error) throw error;
            })
        }catch (error) {
            console.log(error)
        }
    });
});
app.post('/isFriend', function (req, res) {
    const { me, friend } = req.body
    console.log(me, friend)
    pool.getConnection(function (err, connection) {
        try {
 
            var query = "select friendYN from friend where user_no ='"+me+"'and friend_no='"+friend+"'";
            connection.query(query, function (error, results, fields) {
                console.log(results)
                if (results.length>0) {
                    console.log('친구있음')
                    res.send({stat:results});    
                } else {
                    console.log('친구없음')
                    res.send({stat:'Fail'});    
                }
                connection.release();
                if (error) throw error;
            })
        }catch (error) {
            console.log(error)
        }
    });
});
app.post('/updateFriend', function (req, res) {
    const { me, friend } = req.body
    console.log(me, friend)
    pool.getConnection(function (err, connection) {
        try {
 
            var query = "update friend set friendYN = 'Y' where user_no ='"+me+"'and friend_no='"+friend+"'";
            connection.query(query, function (error, results, fields) {
                if (results) {
                    res.send({stat:'OK'});    
                } else {
                    res.send({stat:'Fail'});    
                }
                connection.release();
                if (error) throw error;
            })
        }catch (error) {
            console.log(error)
        }
    });
});
app.post('/getFriend', function (req, res) {
    const { no } = req.body
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        try {
            console.log(no + '의 친구들..')
            var query =`select U.no, U.id, U.nm, U.msg,
                            (select channel_no from user_channel
                            where 1=1
                            and user_no='`+no+`'
                            and channel_no in (select channel_no from user_channel where user_no = U.no)
                            ) as channelNo
                        from user U
                        where U.no in 
                        (select friend_no from friend where user_no = '`+no+`' and friendYN='Y');`

            connection.query(query, function (error, results, fields) {
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
app.post('/check_uc', function (req, res) {
    const { me, you } = req.body
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        try {
            console.log('+'+me+'+')
            console.log('+' + you + '+')
            var query =`select ifnull(max(c.channel_no),'none') as channel_no, 
                        ifnull(max(d.created_at),'none') as created_at, 
                        ifnull(max(d.last_msg),'none')   as last_msg
                        from
                        (
                        select a.channel_no
                        from (select channel_no from user_channel where user_no='`+me+`') a 
                        inner join ((select channel_no from user_channel where user_no='`+you+`')) b
                        on a.channel_no = b.channel_no
                        ) c,
                        channel d
                        where c.channel_no = d.no
                        and d.groupYN ='N'
                    ;`
            connection.query(query, function (error, results, fields) {
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
app.post('/create_channel', function (req, res) {
    const { last_msg, groupYN } = req.body
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        try {
            connection.query("insert channel (last_msg, groupYN) values('"+last_msg+"','"+groupYN+"')", function (error, results, fields) {
                console.log('hi')
                res.send(JSON.stringify(results));
                connection.release();
                if (error) throw error;
            });
            
        }catch (error) {
            console.log(error)
        }
    });
});

app.post('/insert_user_channel', function (req, res) {
    const { me, you } = req.body
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        try {
            var query = `insert user_channel (user_no, channel_no, title, attendenceYN) values('` + me + `',(select max(no) from channel),(select nm from user where no='` + you + `'),'Y')`
            connection.query(query, function (error, results, fields) {
                // res.send(JSON.stringify(results));
                if (error) throw error;
            });
            var query2 = `insert user_channel (user_no, channel_no, title, attendenceYN) values('` + you + `',(select max(no) from channel),(select nm from user where no='`+me+`'),'Y');`
            connection.query(query2, function (error, results, fields) {
                if (error) throw error;
                if (results) {
                    res.send({stat:'OK'});    
                } else {
                    res.send({ stat: 'Fail' });
                }                
                connection.release();
            });
        }catch (error) {
            console.log(error)
        }
    });
});
app.post('/update_channel', function (req, res) {
    const { channelNo, last_msg } = req.body
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        try {
            var query = `update channel set last_msg="`+last_msg+`",created_at=sysdate() where no='`+channelNo+`';`
            connection.query(query, function (error, results, fields) {
                if (error) throw error;
                if (results) {
                    res.send({stat:'OK'});    
                } else {
                    res.send({ stat: 'Fail' });
                }                
                connection.release();
            });
        }catch (error) {
            console.log(error)
        }
    });
});
app.post('/insert_message', function (req, res) {
    const { sender, receiver, channelNo, txt} = req.body
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        try {
            var query = `insert message (sender_no, receiver_no,channel_no,content, created_at) values('`+sender+`','`+receiver+`','`+channelNo+`',"`+txt+`",sysdate());`
            connection.query(query, function (error, results, fields) {
                if (error) throw error;
                if (results) {
                    res.send({stat:'OK'});    
                } else {
                    res.send({ stat: 'Fail' });
                }                
                connection.release();
            });
        }catch (error) {
            console.log(error)
        }
    });
});
app.post('/getMessage', function (req, res) {
    const { channelNo } = req.body
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        try {
            var query = `select m.sender_no as no, u.nm as name, m.channel_no as channelNo, m.content as txt, DATE_FORMAT(m.created_at,'%Y.%m.%d') as day,DATE_FORMAT(m.created_at,'%p %h:%i') as time
                        from message m, user u
                        where m.sender_no = u.no
                        and m.channel_no = '`+channelNo+`' order by m.created_at;`
            connection.query(query, function (error, results, fields) {
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

app.post('/getMsg', function (req, res) {
    const { channelNo } = req.body
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        try {
            var query = `select m.sender_no as no, u.nm as name, m.channel_no as channelNo, m.content as txt, DATE_FORMAT(m.created_at,'%Y.%m.%d') as day,DATE_FORMAT(m.created_at,'%p %H:%i') as time
                        from message m, user u
                        where m.sender_no = u.no
                        and m.channel_no = '`+channelNo+`' order by m.created_at;`
            connection.query(query, function (error, results, fields) {
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

app.post('/getchannelNo', function (req, res) {
    const { me, you } = req.body
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        try {    
            console.log(me);
            console.log(you);
            var query =`select channel_no from user_channel
                        where 1=1
                        and user_no='`+me+`'
                        and channel_no in (select channel_no from user_channel where user_no = '`+you+`');`
            connection.query(query, function (error, results, fields) {
                console.log('aaaaaa');
                var r =JSON.parse(JSON.stringify(results))
                console.log('★★★★★★★★')
                console.log(r[0].channel_no);
                res.send(JSON.stringify(r[0].channel_no));
                connection.release();
                if (error) throw error;
            });
        }catch (error) {
            console.log(error)
        }
    });
});
app.post('/getUserNo', function (req, res) {
    const { id } = req.body
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        try {            
            var query =`select no from user where user_id='`+id+`'`
            connection.query(query, function (error, results, fields) {
                res.send(JSON.stringify(results));
                connection.release();
                if (error) throw error;
            });
        }catch (error) {
            console.log(error)
        }
    });
});

app.post('/get_channel_list', function (req, res) {
    const { no } = req.body
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        try {
            // var query = `select * from channel
            //              where 1=1
            //              and no in (select distinct channel_no from message where 1=1 and sender_no='`+no+`');`

            // var query = `select distinct * from channel c, (select channel_no, sender_no, receiver_no from message) m where c.no = m.channel_no
            //              and (sender_no='`+ no + `' or receiver_no='` + no + `');`
            
            var query = `SELECT DISTINCT c.no,
                                        case date_format(c.created_at,'%Y.%m.%d')
                                            when date_format(now(),'%Y.%m.%d')
	                                        then date_format(c.created_at,'%p%h:%i')
                                            else date_format(c.created_at,'%Y.%m.%d')
                                        END as 'last_update_date'
                                        , c.last_msg, c.groupYN, m.channel_no as 'channelNo',m.sender_no,
                                         m.receiver_no as 'receiver_no',
                                         case '`+no+`'
                                            WHEN m.sender_no
                                            THEN (select nm from user where no=m.receiver_no)
                                            ELSE (select nm from user where no=m.sender_no)
                                        END as 'nm'
                        FROM channel c, (select channel_no, sender_no, receiver_no from message) m where c.no = m.channel_no
                        AND (sender_no='`+no+`' or receiver_no='`+no+`') order by last_update_date desc;`
            
            connection.query(query, function (error, results, fields) {
                res.send(JSON.stringify(results));
                connection.release();
                if (error) throw error;
            });
        }catch (error) {
            console.log(error)
        }
    });
});