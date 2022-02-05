const nodemailer = require('nodemailer')
const email = {
    service: 'Naver',
    host: "smtp.naver.com",
    port: 587,
    auth: {
        user: "smile_666@naver.com",
        pass: "skehahffk2^^"
    }
}
const send = async (option) => {
    nodemailer.createTransport(email).sendMail(option, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log(info);
            return info.response;
        }
    });
};

let data = {
    from: 'smile_666@naver.com',
    to: 'shk9310@gmail.com',
    subject: 'test mail',
    text: 'node.js mail test'
}

send(data);