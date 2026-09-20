/* ============================================================
   Diamond Soap Naturals — Interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const themeToggleMobile = document.getElementById("themeToggleMobile");
  const stored = localStorage.getItem("ds-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (stored) root.setAttribute("data-theme", stored);
  else if (prefersDark) root.setAttribute("data-theme", "dark");

  function toggleTheme() {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("ds-theme", next);
  }
  themeToggle.addEventListener("click", toggleTheme);
  if (themeToggleMobile) themeToggleMobile.addEventListener("click", toggleTheme);

  /* ---------- Mobile Navigation ---------- */
  const navToggle = document.getElementById("navToggle");
  const navDrawer = document.getElementById("navDrawer");
  const navBackdrop = document.getElementById("navBackdrop");
  const navDrawerLinks = navDrawer ? navDrawer.querySelectorAll(".nav-drawer-link") : [];

  function openNavDrawer() {
    navDrawer.classList.add("open");
    if (navBackdrop) navBackdrop.classList.add("open");
    navToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
  }
  function closeNavDrawer() {
    navDrawer.classList.remove("open");
    if (navBackdrop) navBackdrop.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  }
  navToggle.addEventListener("click", () => {
    if (navDrawer.classList.contains("open")) closeNavDrawer();
    else openNavDrawer();
  });
  navDrawerLinks.forEach((link) => {
    link.addEventListener("click", closeNavDrawer);
  });
  if (navBackdrop) {
    navBackdrop.addEventListener("click", closeNavDrawer);
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navDrawer.classList.contains("open")) closeNavDrawer();
  });

  /* ---------- Year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Floating particles ---------- */
  const pWrap = document.getElementById("particles");
  if (pWrap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const COUNT = window.innerWidth < 760 ? 3 : 5;
    const particles = [];
    for (let i = 0; i < COUNT; i++) {
      const p = document.createElement("span");
      p.className = "particle";
      const size = Math.random() * 4 + 2;
      p.style.width = p.style.height = size + "px";
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDuration = (Math.random() * 12 + 10) + "s";
      p.style.animationDelay = (Math.random() * 12) + "s";
      pWrap.appendChild(p);
      particles.push(p);
    }
    document.addEventListener("visibilitychange", () => {
      particles.forEach(p => {
        p.style.animationPlayState = document.hidden ? "paused" : "running";
      });
    });
  }

  /* ---------- Ripple effect ---------- */
  function attachRipple(el) {
    el.addEventListener("pointerdown", (e) => {
      const r = el.getBoundingClientRect();
      const size = Math.max(r.width, r.height);
      const span = document.createElement("span");
      span.className = "ripple";
      span.style.width = span.style.height = size + "px";
      span.style.left = (e.clientX - r.left - size / 2) + "px";
      span.style.top = (e.clientY - r.top - size / 2) + "px";
      el.appendChild(span);
      span.addEventListener("animationend", () => span.remove());
    });
  }
  document.querySelectorAll("[data-ripple]").forEach(attachRipple);

  /* ---------- Scroll reveal ---------- */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let io = null;
  if (!reduce && "IntersectionObserver" in window) {
    io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
  }

  /* ---------- Gallery data ---------- */
  const products = [
    { name: "Aoi", note: "Sidr · Lavender · Olive", img: "assets/image-1.jpg", webp: "assets/image-1.webp" },
    { name: "ren", note: "Blue Tansy · Sea", img: "assets/image-2.jpg", webp: "assets/image-2.webp" },
    { name: "Kuro", note: "Coffee · Lemon · Lavender", img: "assets/image-3.jpg", webp: "assets/image-3.webp" },
    { name: "Hikari", note: "Oat · Lemon", img: "assets/image-4.jpg", webp: "assets/image-4.webp" }
  ];

  const grid = document.getElementById("galleryGrid");
  products.forEach((p, i) => {
    const card = document.createElement("button");
    card.className = "gallery-card reveal";
    card.setAttribute("aria-label", "View " + p.name);
    card.style.transitionDelay = (i % 3) * 0.08 + "s";

    const picture = document.createElement("picture");
    if (p.webp) {
      const source = document.createElement("source");
      source.type = "image/webp";
      source.srcset = p.webp;
      picture.appendChild(source);
    }
    const img = document.createElement("img");
    img.className = "g-img";
    img.src = p.img;
    img.alt = p.name + " — " + p.note;
    img.width = 400;
    img.height = 533;
    img.loading = "lazy";
    picture.appendChild(img);

    card.appendChild(picture);
    const label = document.createElement("div");
    label.className = "g-label";
    label.innerHTML = `${p.name}<span>${p.note}</span>`;
    card.appendChild(label);
    card.addEventListener("click", () => openLightbox(p));
    grid.appendChild(card);
    if (io) io.observe(card); else card.classList.add("in");
  });

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCap = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");
  let lastFocusedElement = null;

  function openLightbox(p) {
    lastFocusedElement = document.activeElement;
    const imgUrl = p.webp || p.img;
    lightboxImg.innerHTML = '';
    const img = document.createElement('img');
    img.src = p.img;
    img.alt = p.name + ' — ' + p.note;
    img.className = 'lightbox-photo';
    lightboxImg.appendChild(img);
    lightboxCap.innerHTML = `<span>${p.note}</span>${p.name}`;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    lightboxClose.focus();
  }
  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    lightboxImg.innerHTML = '';
    if (lastFocusedElement) lastFocusedElement.focus();
  }
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") { closeLightbox(); return; }
    if (e.key === "Tab") {
      e.preventDefault();
      lightboxClose.focus();
    }
  });

  /* ---------- Back to top ---------- */
  const btt = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    btt.classList.toggle("show", window.scrollY > 500);
  }, { passive: true });
  btt.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Active nav link on scroll ---------- */
  const sections = ["home", "about", "gallery", "contact"].map((id) => document.getElementById(id));
  const navLinks = document.querySelectorAll(".nav-link");
  if ("IntersectionObserver" in window) {
    const navIo = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          navLinks.forEach((l) => l.style.color = "");
          const active = document.querySelector('.nav-link[href="#' + en.target.id + '"]');
          if (active) active.style.color = "var(--gold-deep)";
        }
      });
    }, { threshold: 0.4 });
    sections.forEach((s) => s && navIo.observe(s));
  }

  /* ---------- Service Worker ---------- */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }
})();
