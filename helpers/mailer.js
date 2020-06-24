const nodemailer = require('nodemailer')

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP_HOST,
  port: process.env.EMAIL_SMTP_PORT,
  // secure: process.env.EMAIL_SMTP_SECURE, // lack of ssl commented this. You can uncomment it.
  auth: {
    user: process.env.EMAIL_SMTP_USERNAME,
    pass: process.env.EMAIL_SMTP_PASSWORD,
  },
})

// send mail with defined transport object
// visit https://nodemailer.com/ for more options
exports.send = (from, to, subject, html) => transporter.sendMail({
  from, // sender address e.g. no-reply@xyz.com or "Fred Foo 👻" <foo@example.com>
  to, // list of receivers e.g. bar@example.com, baz@example.com
  subject, // Subject line e.g. 'Hello ✔'
  // text: text, // plain text body e.g. Hello world?
  html, // html body e.g. '<b>Hello world?</b>'
})
