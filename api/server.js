const { Resend } = require("resend");

// ✅ Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Use module.exports instead of "export default" 
module.exports = async (req, res) => {
  // 1. Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { name, email, contact, message } = req.body;

  // 2. Basic Validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // 3. Send Email
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', 
      to: 'maddymadhavan347@gmail.com', 
      subject: `📩 New Message from ${name}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2>New Portfolio Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${contact || "Not provided"}</p>
          <p><strong>Message:</strong> ${message}</p>
        </div>
      `,
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("❌ Resend Error:", error);
    return res.status(500).json({ error: "Failed to send email." });
  }
};