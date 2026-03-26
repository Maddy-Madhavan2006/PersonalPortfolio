// === Load environment variables ===
require("dotenv").config(); // Simplest way for Render/Production

const path = require("path");
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
// Render automatically provides process.env.PORT
const PORT = process.env.PORT || 5000;

// === Middleware ===
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://personalportfolio-1-6dbw.onrender.com" // NO trailing slash
  ]
}));
app.use(express.json()); // Built-in alternative to body-parser

// ✅ Serve static files (HTML, CSS, JS, images)
// Assuming server.js is in a 'server' folder and index.html is in the root
const rootPath = path.resolve(__dirname, "..");
app.use(express.static(rootPath));

// === Gmail transporter ===
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // MUST be a 16-character Google App Password
  },
});

// === Verify Gmail transporter on startup ===
transporter.verify((error) => {
  if (error) {
    console.error("❌ Gmail connection failed! Check EMAIL_USER/EMAIL_PASS in Render Env.");
    console.error(error);
  } else {
    console.log("✅ Gmail transporter verified and ready!");
  }
});

// ✅ Route for homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(rootPath, "index.html"));
});

// === Contact API ===
app.post("/api/contact", async (req, res) => {
  const { name, email, contact, message } = req.body;

  // 1. Validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // 2. Setup Email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Sending the mail to yourself
    subject: `📩 New Message from ${name}`,
    text: `
Hey Madhavan 👋,

You got a new message from your portfolio:

👤 Name: ${name}
📧 Email: ${email}
📞 Contact: ${contact || "Not provided"}

💬 Message:
${message}
    `,
  };

  // 3. Send Email with Error Handling
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
    
    // Send success ONLY after mail is sent
    return res.status(200).json({ 
      success: true, 
      message: "🚀 Message delivered successfully!" 
    });
  } catch (error) {
    console.error("❌ Nodemailer Error:", error);
    return res.status(500).json({ 
      error: "Failed to send email. Please try again later." 
    });
  }
});

// === Start server ===
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});