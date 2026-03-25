document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ JS connected");

  /* === Contact Form Handling === */
  const form = document.querySelector(".contact form");

  if (!form) {
    console.error("❌ Contact form not found!");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

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

    if (!name || !email) {
      showToast("⚠️ Please fill in your Name and Email!", "error");
      return;
    }

    console.log("📤 Sending form data:", { name, email, contact, message });

    // Show sending toast
    const sendingToast = showToast("⏳ Sending message...", "info");

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, contact, message }),
      });

      const data = await response.json();

      sendingToast.remove(); // Remove sending toast

      if (response.ok) {
        showToast("Reach You Soon 🤝", "success");
        form.reset();
      } else {
        showToast(`❌ ${data.error || "Something went wrong!"}`, "error");
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      sendingToast.remove();
      showToast("❌ Failed to send message. Server error.", "error");
    }
  });

  /* === Scroll-triggered Section Animations === */
const sections = document.querySelectorAll("section");

function animateSections() {
  sections.forEach(section => {
    if (section.id === "introduction") {
      section.classList.add("visible");
      return;
    }
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      section.classList.add("visible");
    } else {
      section.classList.remove("visible");
    }
  });
}

// Run on scroll
window.addEventListener("scroll", animateSections);

// Run once immediately (DOM ready)
animateSections();

// Run once on full load (images/videos loaded) for mobile reliability and force scroll to top
window.addEventListener("load", () => {
  // Disable browser’s automatic scroll restoration
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  // Scroll to top
  window.scrollTo(0, 0);

  // Animate sections after scrolling to top
  animateSections();
});


  /* === Mobile Navbar Toggle === */
  const menuToggle = document.getElementById('mobile-menu');
  const navMenu = document.querySelector('.nav-links');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');      // show/hide menu
      menuToggle.classList.toggle('animate');  // toggle animation
    });
  }

  /* === Smooth Scroll for Nav Links === */
  const navLinks = document.querySelectorAll(".navigation a[href^='#']");
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }

      // Close mobile menu when a link is clicked
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('animate');
      }
    });
  });
});

/* === Toast Messages === */
function showToast(message, type) {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Show animation
  setTimeout(() => toast.classList.add("show"), 100);

  // Auto-hide after 4s
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 4000);

  return toast; // Return toast element for programmatic removal
}
