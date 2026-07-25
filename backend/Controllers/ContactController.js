import Contact from "../Models/ContactSchema.js";
import sendEmail from "../utils/SendEmail.js";
import { adminEmailTemplate, userEmailTemplate } from "../utils/emailTemplates.js";

export const contact = async (req, res) => {
  try {
    const { name, email, phone, orderNumber, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, Email and Message are required fields.",
      });
    }

    // Save to DB
    const newContact = await Contact.create({
      name,
      email,
      phone,
      orderNumber,
      subject: subject || "General Inquiry",
      message,
    });

    // ── 1. Admin Notification Email ───────────────────────────────────────
    // TO: Admin Email (process.env.Gmailuser)
    // Reply-To: Customer's email so admin can directly click reply to respond
    try {
      await sendEmail({
        from: `"NexCart Customer Support" <${process.env.Gmailuser}>`,
        to: process.env.Gmailuser,
        replyTo: email,
        subject: `[New Inquiry] ${subject || "General Inquiry"} - from ${name}`,
        html: adminEmailTemplate(req.body),
      });
    } catch (adminEmailErr) {
      console.error("Admin email failed:", adminEmailErr.message);
    }

    // ── 2. Thank You Confirmation Email to Customer ──────────────────────
    // TO: Customer Email
    try {
      await sendEmail({
        from: `"NexCart Store" <${process.env.Gmailuser}>`,
        to: email,
        subject: "Thank You for Contacting NexCart Support",
        html: userEmailTemplate(req.body),
      });
    } catch (userEmailErr) {
      console.error("User confirmation email failed:", userEmailErr.message);
    }

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully. We will get back to you soon!",
      data: newContact,
    });
  } catch (err) {
    console.error("Contact controller error:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
