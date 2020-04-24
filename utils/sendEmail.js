const nodemailer = require("nodemailer");

async function sendEmail(userEmail) {
  let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Admin" <admin@book-management.com>',
    to: userEmail, // list of receivers
    subject: "Wrong Login Over 3 times", // Subject line
    text:
      "Your account was locked because you logged in wrong over 3 times. Please contact to admin to unlock your account."
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

module.exports = sendEmail;
