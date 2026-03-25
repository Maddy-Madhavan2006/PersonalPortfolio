// === Load environment variables ===
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

// === Core modules ===
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 5000;

// === Middleware ===
app.use(cors());
app.use(bodyParser.json());

// ✅ Serve static files (HTML, CSS, JS, images)
app.use(express.static(path.resolve(__dirname, "..")));

// ✅ Route for homepage
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "index.html"));
});

// === Gmail transporter ===
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// === Verify Gmail transporter ===
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Gmail connection failed! Check your .env file.");
    console.error(error);
  } else {
    console.log("✅ Gmail transporter verified and ready!");
  }
});

// === Contact API ===
app.post("/api/contact", (req, res) => {
  const { name, email, contact, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and Email are required." });
  }

  // Send response immediately
  res.json({ success: true, message: "🚀 Message delivered!" });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `📩 New Message from ${name}`,
    text: `
Hey Madhavan 👋,

You got a new message:

👤 Name: ${name}
📧 Email: ${email}
📞 Contact: ${contact || "Not provided"}
💬 Message:
${message}
    `,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Email error:", error);
    } else {
      console.log("✅ Email sent:", info.response);
    }
  });
});

// === Start server ===
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("📁 Serving files from:", path.resolve(__dirname, ".."));
});