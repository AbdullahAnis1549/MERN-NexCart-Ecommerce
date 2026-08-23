import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendEmail = async ({ from, to, replyTo, subject, text, html }) => {
  try {
    const user = process.env.Gmailuser;
    const pass = process.env.Gmailpassword ? process.env.Gmailpassword.replace(/\s+/g, "") : "";

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from: from || `"NexCart Store" <${user}>`,
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
    console.log("✅ Email Sent successfully to:", to, "| MessageId:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email Error for:", to, "| Error:", error.message || error);
  }
};

export default sendEmail;