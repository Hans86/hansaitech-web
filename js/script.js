/* ============================================================
   HANSAITECH — Shared Script
   ============================================================ */

// ── Mobile Menu ──────────────────────────────────────────────
const menuBtn   = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    menuBtn.classList.toggle("open", isOpen);
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      menuBtn.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

// ── Year in footer ────────────────────────────────────────────
document.querySelectorAll(".year").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// ── Active nav link ───────────────────────────────────────────
const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
document.querySelectorAll(".desktop-nav a, .mobile-nav a").forEach((a) => {
  const href = a.getAttribute("href").replace(/\/$/, "") || "/";
  if (href === currentPath) {
    a.classList.add("active");
  }
});

// ── Scroll: header shadow ─────────────────────────────────────
const header = document.querySelector(".site-header");
if (header) {
  window.addEventListener("scroll", () => {
    header.style.boxShadow = window.scrollY > 20
      ? "0 4px 24px rgba(0,0,0,0.35)"
      : "none";
  }, { passive: true });
}

// ── Counter animation ─────────────────────────────────────────
function animateCounters() {
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "+";
    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(ease * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

// Trigger counters when stats bar is visible
const statsSection = document.querySelector(".stats-bar, .about-intro");
if (statsSection) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    },
    { threshold: 0.3 }
  );
  observer.observe(statsSection);
} else {
  // Run immediately if stat elements are on the page
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCounters();
            obs.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(counters[0]);
  }
}

// ── FAQ accordion ─────────────────────────────────────────────
document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    const isOpen = item.classList.contains("open");
    // Close all
    document.querySelectorAll(".faq-item.open").forEach((i) => i.classList.remove("open"));
    // Toggle current
    if (!isOpen) item.classList.add("open");
  });
});

// ── Portfolio filter ──────────────────────────────────────────
const filterTabs = document.getElementById("filterTabs");
const portfolioGrid = document.getElementById("portfolioGrid");

if (filterTabs && portfolioGrid) {
  filterTabs.addEventListener("click", (e) => {
    const tab = e.target.closest(".filter-tab");
    if (!tab) return;

    filterTabs.querySelectorAll(".filter-tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    const filter = tab.dataset.filter;
    portfolioGrid.querySelectorAll(".portfolio-card").forEach((card) => {
      const cats = (card.dataset.category || "").split(" ");
      const show = filter === "all" || cats.includes(filter);
      card.style.display = show ? "" : "none";
      if (show) {
        card.style.animation = "fadeUp 0.4s ease both";
      }
    });
  });
}

// ── Contact form (demo) ───────────────────────────────────────
const contactForm = document.getElementById("contactForm");
const successMsg  = document.getElementById("successMsg");
const submitBtn   = document.getElementById("submitBtn");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Simple required validation
    let valid = true;
    contactForm.querySelectorAll("[required]").forEach((field) => {
      if (!field.value.trim()) {
        field.style.borderColor = "#f87171";
        valid = false;
      } else {
        field.style.borderColor = "";
      }
    });

    if (!valid) return;

    submitBtn.disabled = true;
    submitBtn.textContent = "送出中...";

    // Simulate network request
    setTimeout(() => {
      contactForm.style.display = "none";
      successMsg.style.display = "block";
    }, 1000);
  });
}

// ── Scroll-reveal animation ───────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".card, .process-step, .team-card, .value-card").forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(20px)";
  el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  revealObserver.observe(el);
});
