import nodemailer from "nodemailer";
import Message from "../models/Message.js";

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
};

// POST /api/contact
export const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    const saved = await Message.create({ name, email, subject, message });

    const mailer = getTransporter();
    if (mailer && process.env.CONTACT_RECEIVER_EMAIL) {
      try {
        await mailer.sendMail({
          from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
          to: process.env.CONTACT_RECEIVER_EMAIL,
          replyTo: email,
          subject: subject || `New message from ${name}`,
          text: `From: ${name} <${email}>\n\n${message}`,
          html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message.replace(/\n/g, "<br/>")}</p>`,
        });
      } catch (mailErr) {
        // Don't fail the request just because email delivery failed —
        // the message is already safely stored in the database.
        console.error("Email send failed:", mailErr.message);
      }
    }

    res.status(201).json({
      success: true,
      message: "Thanks for reaching out — I'll get back to you soon.",
      data: { id: saved._id },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/contact (admin use — listing messages)
export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/contact/:id/read
export const markRead = async (req, res, next) => {
  try {
    const msg = await Message.findByIdAndUpdate(
      req.params.id,
      { read: req.body.read !== undefined ? req.body.read : true },
      { new: true }
    );
    if (!msg) { res.status(404); throw new Error("Message not found"); }
    res.json({ success: true, data: msg });
  } catch (err) { next(err); }
};

// DELETE /api/contact/:id
export const deleteMessage = async (req, res, next) => {
  try {
    const msg = await Message.findByIdAndDelete(req.params.id);
    if (!msg) { res.status(404); throw new Error("Message not found"); }
    res.json({ success: true, message: "Message deleted" });
  } catch (err) { next(err); }
};
