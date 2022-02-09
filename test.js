const nodemailer = require('nodemailer')
const email = {
    service: 'Google',
    host: "smtp.gmail.com",
    port: 465,
    auth: {
        user: "shk9310@gmail.com",
        pass: "tkdgus93.."
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
    from: 'shk9310@gmail.com',
    to: 'smile_666@naver.com',
    subject: 'test mail',
    text: 'node.js mail test'
}

send(data);