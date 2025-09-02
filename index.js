// index.js — stable mobile nav + theme + shrink + anchors + reveal
document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // Theme toggle (data-theme)
  // =========================
  const root = document.documentElement;
  const themeBtn = document.getElementById("themeBtn");

  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = savedTheme || (prefersDark ? "dark" : "light");

  // Apply initial
  if (initial === "dark") {
    root.setAttribute("data-theme", "dark");
    if (themeBtn) themeBtn.textContent = "☀️";
  } else {
    root.removeAttribute("data-theme");
    if (themeBtn) themeBtn.textContent = "🌙";
  }

  function setTheme(next) {
    if (next === "dark") {
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      if (themeBtn) themeBtn.textContent = "☀️";
    } else {
      root.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
      if (themeBtn) themeBtn.textContent = "🌙";
    }
  }

  themeBtn?.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    setTheme(isDark ? "light" : "dark");
  });

  // =========================
  // Mobile menu (.hamburger + .links)
  // =========================
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");

  if (hamburger && mobileNav) {
    // toggle menu
    hamburger.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("show");

      if (isOpen) {
        mobileNav.removeAttribute("hidden");
        hamburger.classList.add("active");
        hamburger.setAttribute("aria-expanded", "true");
      } else {
        mobileNav.setAttribute("hidden", "");
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });

    // close menu when clicking a link
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.setAttribute("hidden", "");
        mobileNav.classList.remove("show");
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });

    // Auto-reset on resize (prevents stuck open state)
    window.addEventListener("resize", () => {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;

      if (!isMobile) {
        // Desktop view → rely on CSS (always visible if needed)
        mobileNav.classList.remove("show");
        mobileNav.setAttribute("hidden", "");
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
      } else {
        // Mobile default → menu hidden until toggled
        mobileNav.classList.remove("show");
        mobileNav.setAttribute("hidden", "");
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });
  }

  // =========================
  // Shrink header on scroll
  // =========================
  const header = document.querySelector("header");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("shrink", window.scrollY > 50);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // =========================
  // Active link highlight
  // =========================
  const navAnchors = Array.from(
    document.querySelectorAll('.links a[href^="#"], .primary-nav a[href^="#"]')
  );
  const targets = navAnchors
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if (targets.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = targets.indexOf(entry.target);
          if (idx > -1) {
            const a = navAnchors[idx];
            if (entry.isIntersecting) a.classList.add("active");
            else a.classList.remove("active");
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    targets.forEach((t) => io.observe(t));
  }

  // =========================
  // Smooth anchor scroll
  // =========================
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", id);
  });

  // =========================
  // Reveal on scroll
  // =========================
  const revealEls = document.querySelectorAll(".section, .hero-grid, .project");
  if (revealEls.length) {
    const rev = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("active");
            rev.unobserve(en.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => {
      el.classList.add("reveal");
      rev.observe(el);
    });
  }

  // =========================
  // Year
  // =========================
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

let lastMessage = null; // store last message

function showToast(message, isSuccess = true) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.style.background = isSuccess ? "#4BB543" : "#FF3333"; // green/red
  toast.className = "toast show";

  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 3000);
}

document
  .querySelector("form[name='contact']")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    const currentMessage = `${name}|${email}|${message}`;
    const sendBtn = e.target.querySelector("button[type=submit]");

    // ✅ Prevent duplicate submission of same data
    if (currentMessage === lastMessage) {
      showToast("⚠️ You already sent this message!", false);
      return;
    }

    // 🔒 Disable button while sending
    sendBtn.disabled = true;
    sendBtn.textContent = "Sending...";

    const params = { name, email, message };

    emailjs.send("service_wzmnhh9", "template_2cygafe", params).then(
      function () {
        showToast("✅ Message sent successfully!");
        lastMessage = currentMessage; // save as last sent
        e.target.reset();
      },
      function (error) {
        showToast("❌ Failed to send. Try again.", false);
        console.error("Error", error);
      }
    ).finally(() => {
      // 🔓 Re-enable button after attempt
      sendBtn.disabled = false;
      sendBtn.textContent = "Send";
    });
  });
