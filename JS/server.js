require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const { Resend } = require("resend"); // Updated to use Resend

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY); // Use your new API Key
const PORT = process.env.PORT || 5000;

// === Middleware ===
app.use(cors()); // Simplified for easier freelancing
app.use(express.json());

// ✅ Serve static files from the root directory
const rootPath = path.resolve(__dirname, "..");
app.use(express.static(rootPath));

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

  // 2. Send Email with Resend
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // Default sender for Resend free tier
      to: 'iamdevelopermaddy@gmail.com',     // REPLACE with your actual Gmail address
      subject: `📩 New Message from ${name}`,
      html: `
        <h3>Hey Madhavan 👋,</h3>
        <p>You got a new message from your portfolio:</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${contact || "Not provided"}</li>
        </ul>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    });

    console.log("✅ Email sent successfully:", data.id);
    return res.status(200).json({ 
      success: true, 
      message: "🚀 Message delivered successfully!" 
    });
  } catch (error) {
    console.error("❌ Resend Error:", error);
    return res.status(500).json({ 
      error: "Failed to send email. Please try again later." 
    });
  }
});

// For Vercel compatibility
module.exports = app;

// Local testing
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}