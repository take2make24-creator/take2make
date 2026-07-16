// ============================================================
// TAKE2MAKE — interactions
// ============================================================

document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- nav scroll state ---------- */
const nav = document.getElementById("nav");
const toTop = document.getElementById("toTop");

function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle("scrolled", y > 40);
  toTop.classList.toggle("visible", y > 600);
}
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

toTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ---------- mobile nav ---------- */
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");

burger.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  burger.classList.toggle("open", isOpen);
  burger.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("[data-nav]").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  });
});

/* ---------- cursor glow (desktop only) ---------- */
const glow = document.getElementById("cursorGlow");
if (window.matchMedia("(hover: hover)").matches) {
  window.addEventListener("pointermove", (e) => {
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  });
}

/* ---------- scroll reveal ---------- */
const revealEls = document.querySelectorAll(".reveal, .reveal-line");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        setTimeout(() => el.classList.add("in-view"), i * 40);
        io.unobserve(el);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
);
revealEls.forEach((el) => io.observe(el));

/* ---------- animated stat counters ---------- */
const statEls = document.querySelectorAll(".stat__num");
const statIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      statIO.unobserve(el);

      const nonNumeric = el.dataset.nonnumeric;
      if (nonNumeric) {
        el.textContent = nonNumeric;
        return;
      }

      const target = parseInt(el.dataset.count, 10) || 0;
      const suffix = el.dataset.suffix || "";
      const duration = 1200;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  },
  { threshold: 0.6 }
);
statEls.forEach((el) => statIO.observe(el));

/* ---------- active nav link on scroll ---------- */
const sections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll(".nav__links a[data-nav]");

const sectionIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute("id");
      navAnchors.forEach((a) => {
        a.style.color = a.getAttribute("href") === `#${id}` ? "var(--text)" : "";
      });
    });
  },
  { threshold: 0.5 }
);
sections.forEach((s) => sectionIO.observe(s));
