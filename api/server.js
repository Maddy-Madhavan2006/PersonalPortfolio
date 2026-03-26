const { Resend } = require("resend");

// ✅ No more express, no more app.listen, no more path/cors
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // 1. Only allow POST (The 'Method Not Allowed' Fix)
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { name, email, contact, message } = req.body;

  // 2. Basic Validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // 3. Send Email with Resend
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', 
      to: 'maddymadhavan347@gmail.com', 
      subject: `📩 New Message from ${name}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #007bff;">Hey Madhavan 👋,</h2>
          <p>You received a new message from your portfolio contact form:</p>
          <hr>
          <p><strong>👤 Name:</strong> ${name}</p>
          <p><strong>📧 Email:</strong> ${email}</p>
          <p><strong>📞 Contact:</strong> ${contact || "Not provided"}</p>
          <p><strong>💬 Message:</strong></p>
          <blockquote style="background: #f9f9f9; border-left: 5px solid #ccc; padding: 10px;">
            ${message}
          </blockquote>
        </div>
      `,
    });

    console.log("✅ Email sent successfully:", data.id);

    return res.status(200).json({
      success: true,
      message: "🚀 Message delivered successfully!",
    });

  } catch (error) {
    console.error("❌ Resend Error:", error);
    return res.status(500).json({
      error: "Failed to send email. Please try again later.",
    });
  }
}