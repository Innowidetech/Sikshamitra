const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendEmail = async (to, replyTo, subject, htmlContent) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to,
    replyTo,
    subject,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};