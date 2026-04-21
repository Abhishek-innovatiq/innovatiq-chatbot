const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

// Configure your SMTP here
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

router.post("/send-email", async (req, res) => {
  const { emailTo, interest, name, email, phone, company, message, chatHistory } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email and message are required." });
  }

  const htmlContent = `
    <div style="font-family: Segoe UI, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
      <div style="background: #E8174B; padding: 20px 24px;">
        <h2 style="color: white; margin: 0;">New Chatbot Inquiry</h2>
        <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0;">Innovatiq Support Chatbot</p>
      </div>
      <div style="padding: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #888; font-size: 13px; width: 120px;">Interest</td><td style="padding: 8px 0; font-weight: 600; color: #E8174B;">${interest}</td></tr>
          <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Name</td><td style="padding: 8px 0;">${name}</td></tr>
          <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #E8174B;">${email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Phone</td><td style="padding: 8px 0;">${phone || "Not provided"}</td></tr>
          <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Company</td><td style="padding: 8px 0;">${company || "Not provided"}</td></tr>
          <tr><td style="padding: 8px 0; color: #888; font-size: 13px; vertical-align: top;">Message</td><td style="padding: 8px 0;">${message}</td></tr>
        </table>
        <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 20px 0;" />
        <h4 style="color: #444; margin: 0 0 10px;">Chat History</h4>
        <pre style="background: #f9f9f9; border-radius: 8px; padding: 14px; font-size: 12px; color: #555; white-space: pre-wrap; border: 1px solid #eee;">${chatHistory}</pre>
      </div>
      <div style="background: #f9f9f9; padding: 14px 24px; text-align: center; font-size: 12px; color: #aaa;">
        Sent from Innovatiq Website Chatbot · ${new Date().toLocaleString()}
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Innovatiq Chatbot" <${process.env.SMTP_USER}>`,
      to: emailTo,
      replyTo: email,
      subject: `[Chatbot Inquiry] ${interest} - ${name}`,
      html: htmlContent,
    });
    res.json({ success: true, message: "Email sent successfully." });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ error: "Failed to send email." });
  }
});

module.exports = router;