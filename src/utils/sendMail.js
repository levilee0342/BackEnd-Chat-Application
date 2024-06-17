import nodemailer from "nodemailer";
import "dotenv/config";
const sendMail = async (to, link) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // send mail with defined transport object
    await transporter.sendMail({
      from: `Chat with me <${process.env.MAIL_USER}>`, // sender address
      to, // list of receivers
      subject: "[Chat with me] Please reset your password", // Subject line
      text: "Click on the link to reset password", // plain text body
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
      </head>
      <body>
        <h1>Reset your password</h1>
        <p>
          Click the link to reset your password
          <a href=${link}>Reset Password</a>
        </p>
        <p>The password reset link expires in 5 minutes</p>
      </body>
      </html>`, // html body
    });
  }
  try {
  } catch (error) {}
  try {
    await main();
    console.log("send mail success");
  } catch (error) {
    console.log("An error when send mail", error.message);
  }
};

export default sendMail;
