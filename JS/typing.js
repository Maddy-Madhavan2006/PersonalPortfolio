// === Typing Effect for Intro ===

// The words that will be typed in sequence
const words = [
  "Web Development",
  "App Development",
  "UI/UX Design",
  "Free Lancing",
];

let wordIndex = 0;
let charIndex = 0;
let typing = true;
const typingElement = document.getElementById("typing");

function type() {
  if (!typingElement) return; // Safety check if element not found

  if (typing) {
    // Typing characters one by one
    typingElement.textContent = words[wordIndex].substring(0, charIndex + 1);
    charIndex++;

    // Once full word is typed, pause briefly
    if (charIndex === words[wordIndex].length) {
      typing = false;
      setTimeout(type, 1000); // Wait 1s before deleting
      return;
    }
  } else {
    // Deleting characters one by one
    typingElement.textContent = words[wordIndex].substring(0, charIndex - 1);
    charIndex--;

    // Once deleted fully, move to next word
    if (charIndex === 0) {
      typing = true;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }

  // Adjust speed dynamically for smoother flow
  const typingSpeed = typing ? 120 : 80;
  setTimeout(type, typingSpeed);
}

// Start typing when DOM is ready
document.addEventListener("DOMContentLoaded", type);



// === Lottie Animation Trigger for About Me ===

document.addEventListener("DOMContentLoaded", () => {
  const aboutSection = document.querySelector(".aboutme");

  if (!aboutSection) return; // Exit if About Me section not found

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          aboutSection.classList.add("visible");

          // Play Lottie animation when visible
          const lottiePlayer = aboutSection.querySelector("lottie-player");
          if (lottiePlayer) {
            lottiePlayer.play();
          }

          // Unobserve so it happens only once
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 } // Trigger when 30% of section is visible
  );

  observer.observe(aboutSection);
});
