const nodemailer = require('nodemailer');
// 메일발송 객체
const mailSender = {
  // 메일발송 함수
  sendMyEmail: function (param) {
    var transporter = nodemailer.createTransport({
      service: 'naver',   // 메일 보내는 곳
      port: 587,
      host: 'smtp.naver.com', 
      auth: {
        user: "smile_666@naver.com",  // 보내는 메일의 주소
        pass: "skehahffk1!!"   // 보내는 메일의 비밀번호
      }
    });
    // 메일 옵션
    var mailOptions = {
      from: "smile_666@naver.com", // 보내는 메일의 주소
      to: param.toEmail, // 수신할 이메일
      subject: param.subject, // 메일 제목
      text: param.text // 메일 내용
    };
    
    // 메일 발송    
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        console.log(param.text);
          
      }
    });
        transporter.close();
  }
}

module.exports = mailSender;
