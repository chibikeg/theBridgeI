/* The Bridge Initiative — shared script for all inner pages. */
(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Mobile navigation ───────────────────────────────────────────────── */
  const menuToggle = document.querySelector("#menu-toggle");
  const siteMenu   = document.querySelector("#site-menu");
  if (menuToggle && siteMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
      siteMenu.classList.toggle("hidden", isOpen);
    });
    siteMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        if (window.matchMedia("(max-width: 767px)").matches) siteMenu.classList.add("hidden");
      });
    });
    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 768px)").matches) {
        siteMenu.classList.remove("hidden");
        menuToggle.setAttribute("aria-expanded", "false");
      } else if (menuToggle.getAttribute("aria-expanded") !== "true") {
        siteMenu.classList.add("hidden");
      }
    });
  }

  /* ── Active nav link (marks current page) ───────────────────────────── */
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link[href]").forEach((link) => {
    const linkFile = link.getAttribute("href").split("/").pop();
    if (linkFile === currentPath) {
      link.setAttribute("aria-current", "page");
    }
  });

  /* ── Scroll-reveal ───────────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach((el) => obs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ── Back-to-top ─────────────────────────────────────────────────────── */
  const backToTop = document.querySelector("#back-to-top");
  const updateBtt = () => {
    if (!backToTop) return;
    backToTop.classList.toggle("hidden", window.scrollY <= 600);
  };
  window.addEventListener("scroll", updateBtt, { passive: true });
  updateBtt();
  backToTop?.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" })
  );

  /* ── Dynamic year ────────────────────────────────────────────────────── */
  const yearEl = document.querySelector("#current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── FAQ accordion ───────────────────────────────────────────────────── */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-question");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      // Close all others
      document.querySelectorAll(".faq-item.is-open").forEach((other) => {
        if (other !== item) {
          other.classList.remove("is-open");
          other.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
        }
      });
      item.classList.toggle("is-open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  /* ── Countdown timer ─────────────────────────────────────────────────── */
  const countdownEl = document.querySelector("#conference-countdown");
  if (countdownEl) {
    const target = new Date("2026-11-21T11:00:00+01:00").getTime();
    const daysEl  = countdownEl.querySelector("[data-cd-days]");
    const hrsEl   = countdownEl.querySelector("[data-cd-hours]");
    const minsEl  = countdownEl.querySelector("[data-cd-minutes]");
    const secsEl  = countdownEl.querySelector("[data-cd-seconds]");

    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) {
        countdownEl.querySelector(".countdown-block").innerHTML =
          '<p class="text-bridge-lime font-bold">The conference is underway.</p>';
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000)  / 60000);
      const s = Math.floor((diff % 60000)    / 1000);
      if (daysEl)  daysEl.textContent  = String(d).padStart(2, "0");
      if (hrsEl)   hrsEl.textContent   = String(h).padStart(2, "0");
      if (minsEl)  minsEl.textContent  = String(m).padStart(2, "0");
      if (secsEl)  secsEl.textContent  = String(s).padStart(2, "0");
    }
    if (!reducedMotion) {
      tick();
      setInterval(tick, 1000);
    } else {
      tick(); // show static value, no interval
    }
  }
})();
