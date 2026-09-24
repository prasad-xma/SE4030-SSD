const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function sendEmail(to, subject, msg) {
  const mailOptions = {
     from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    html: msg,
  };

  return transporter.sendMail(mailOptions); // returns a promise
}

module.exports = sendEmail;
