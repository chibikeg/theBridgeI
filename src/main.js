/* The Bridge Initiative website interactions. */
(() => {
  "use strict";

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Mobile navigation
  const menuToggle = document.querySelector("#menu-toggle");
  const siteMenu = document.querySelector("#site-menu");
  if (menuToggle && siteMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Open navigation menu" : "Close navigation menu",
      );
      siteMenu.classList.toggle("hidden", isOpen);
    });
    siteMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        if (window.matchMedia("(max-width: 767px)").matches)
          siteMenu.classList.add("hidden");
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

  // Hero carousel: central slide data keeps content easy to edit.
  const slidesData = [
    {
      kicker: "Upcoming conference · 21 November 2026",
      overline: "Digital for Impact 1.0",
      title: "Leading, Building, and Innovating in the Age of AI & Blockchain",
      description:
        "A gathering to explore how emerging technologies can help us build, collaborate and create meaningful impact.",
      cta: "Explore the Conference",
      href: "#conference",
    },
    {
      kicker: "The Bridge Initiative · Our purpose",
      overline: "Connection creates possibility",
      title: "Helping young people connect ideas with opportunity.",
      description:
        "We create room for conversations about purpose, learning, relationships, culture and the future we can build together.",
      cta: "Discover Our Story",
      href: "#about",
    },
    {
      kicker: "Community · Participation · Action",
      overline: "There is room for you",
      title: "Bring your skills. Share your perspective. Build with us.",
      description:
        "Join a community of people who want to learn, contribute and help create meaningful change around them.",
      cta: "Join Our Community",
      href: "#join",
    },
  ];
  const carousel = document.querySelector("#hero-carousel");
  const slides = [...document.querySelectorAll(".hero-slide")];
  const dots = [...document.querySelectorAll("[data-go-slide]")];
  const heroKicker = document.querySelector("#hero-kicker");
  const heroOverline = document.querySelector("#hero-overline");
  const heroTitle = document.querySelector("#hero-title");
  const heroDescription = document.querySelector("#hero-description");
  const heroPrimary = document.querySelector("#hero-primary");
  const pauseButton = document.querySelector("#carousel-pause");
  let activeSlide = 0;
  let carouselTimer = null;
  let isPaused = reducedMotion;
  let touchStartX = null;

  function showSlide(index) {
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === activeSlide;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    dots.forEach((dot, i) =>
      dot.setAttribute("aria-current", String(i === activeSlide)),
    );
    const data = slidesData[activeSlide];
    heroKicker.textContent = data.kicker;
    heroOverline.textContent = data.overline;
    heroTitle.textContent = data.title;
    heroDescription.textContent = data.description;
    heroPrimary.href = data.href;
    heroPrimary.innerHTML = `${data.cta} <span aria-hidden="true">↗</span>`;
  }
  function stopCarousel() {
    if (carouselTimer) window.clearInterval(carouselTimer);
    carouselTimer = null;
  }
  function startCarousel() {
    stopCarousel();
    if (!isPaused && !reducedMotion)
      carouselTimer = window.setInterval(
        () => showSlide(activeSlide + 1),
        7000,
      );
    if (pauseButton) {
      pauseButton.textContent = isPaused ? "Play" : "Pause";
      pauseButton.setAttribute("aria-pressed", String(isPaused));
    }
  }
  document.querySelector("#carousel-prev")?.addEventListener("click", () => {
    showSlide(activeSlide - 1);
    startCarousel();
  });
  document.querySelector("#carousel-next")?.addEventListener("click", () => {
    showSlide(activeSlide + 1);
    startCarousel();
  });
  dots.forEach((dot) =>
    dot.addEventListener("click", () => {
      showSlide(Number(dot.dataset.goSlide));
      startCarousel();
    }),
  );
  pauseButton?.addEventListener("click", () => {
    isPaused = !isPaused;
    startCarousel();
  });
  carousel?.addEventListener("mouseenter", () => {
    if (!isPaused) stopCarousel();
  });
  carousel?.addEventListener("mouseleave", () => {
    if (!isPaused) startCarousel();
  });
  carousel?.addEventListener("focusin", () => stopCarousel());
  carousel?.addEventListener("focusout", () => {
    if (!isPaused) startCarousel();
  });
  carousel?.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].screenX;
    },
    { passive: true },
  );
  carousel?.addEventListener(
    "touchend",
    (event) => {
      if (touchStartX === null) return;
      const delta = event.changedTouches[0].screenX - touchStartX;
      if (Math.abs(delta) > 45) showSlide(activeSlide + (delta < 0 ? 1 : -1));
      touchStartX = null;
      startCarousel();
    },
    { passive: true },
  );
  startCarousel();

  // Reveal-on-scroll, with a graceful fallback for older browsers.
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  // Back-to-top button and dynamic footer year.
  const backToTop = document.querySelector("#back-to-top");
  document.querySelector("#current-year").textContent =
    new Date().getFullYear();
  const updateBackToTop = () => {
    if (window.scrollY > 600) backToTop?.classList.remove("hidden");
    else backToTop?.classList.add("hidden");
  };
  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();
  backToTop?.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }),
  );
})();
