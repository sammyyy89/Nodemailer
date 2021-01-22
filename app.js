const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.render('contact', {layout: false}); 
});

app.post('/send', (req, res) => {
    const output = `
   <h3>새로운 공지사항이 있습니다.</h3>
   <h3>Message</h3>
   <p>${req.body.message}</p>
   `;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.mailtrap.io', // 추후 실제 도메인으로 변경 
        port: 2525,
        secure: false, // true for 465, false for other ports
        auth: {
            user: '39687d913f70f5', // generated ethereal user
            pass: '8a67b1de57ed2f' // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Assi Groupware" <sman@assiplaza.com>', // sender address
        to: 'saemi0809@google.com', // list of receivers
        subject: '새 공지사항 알림', // Subject line
        text: '새로운 공지사항이 있습니다.', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('contact', {
            msg: '이메일이 전송되었습니다.'
        });
    });
});

app.listen(3000, () => console.log('Server started...'));