const nodemailer = require('nodemailer');

const {MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS} = process.env;

const transport = nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    auth: {
        user:MAIL_USER,
        pass:MAIL_PASS
    }
});

const makeANiceEmail = text => `
    <div class="email" style="border:1px solid #A0A0A0; padding: 20px line-height:2">
        <h2>Hello</h2>
        <p>${text}</p>
        <p>Kind regards, Sick Fits</p>
    </div>
`;


exports.makeANiceEmail = makeANiceEmail;
exports.transport = transport;
