import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.Gmailuser,
    pass: process.env.Gmailpassword,
  },
});

const sendEmail = async ({ from, to, replyTo, subject, text, html }) => {
  try {
    const mailOptions = {
      from: from || `"NexCart Store" <${process.env.Gmailuser}>`,
      to,
      subject,
    };

    if (replyTo) {
      mailOptions.replyTo = replyTo;
    }

    if (html) {
      mailOptions.html = html;
    } else {
      mailOptions.text = text;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log("Email Sent to:", to, "| MessageId:", info.messageId);
  } catch (error) {
    console.error("Email Error for:", to, "| Error:", error.message || error);
  }
};

export default sendEmail;