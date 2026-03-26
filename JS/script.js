document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ JS connected");

  /* === Contact Form Handling === */
  const form = document.querySelector(".contact form");
  const submitBtn = form?.querySelector("button[type='submit']"); // Get the button

  if (!form) {
    console.error("❌ Contact form not found!");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Select fields
    const nameField = document.querySelector("#name");
    const emailField = document.querySelector("#email");
    const phoneField = document.querySelector("#phone");
    const messageField = document.querySelector("#message");

    if (!nameField || !emailField || !phoneField || !messageField) {
      showToast("⚠️ Form fields missing in Contact", "error");
      return;
    }

    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const contact = phoneField.value.trim();
    const message = messageField.value.trim();

    if (!name || !email || !message) {
      showToast("⚠️ Please fill in all required fields!", "error");
      return;
    }

    // --- Start Sending Process ---
    console.log("📤 Sending form data...");
    
    // Disable button to prevent double-clicks
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = "Sending...";
    }

    const sendingToast = showToast("⏳ Sending message...", "info");

    try {
      // ✅ RELATIVE URL: Works on localhost and Vercel automatically
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, contact, message }),
      });

      const data = await response.json();
      sendingToast.remove(); // Remove the "Sending..." message

      if (response.ok) {
        showToast("Reach You Soon 🤝", "success");
        form.reset();
      } else {
        showToast(`❌ ${data.error || "Something went wrong!"}`, "error");
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      sendingToast.remove();
      showToast("❌ Connection error. Please try again.", "error");
    } finally {
      // Re-enable button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = "Send Message";
      }
    }
  });

  /* === All other code (Animations, Nav, etc.) stays exactly the same === */
  // ... (Keep your scroll animations and mobile menu logic here)
  
  // (Paste the rest of your original scroll and menu logic below)
});

/* === Toast Messages === */
function showToast(message, type) {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }
  }, 4000);

  return toast; 
}