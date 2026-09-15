/* ============================================================
   Diamond Soap Naturals — Interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const stored = localStorage.getItem("ds-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (stored) root.setAttribute("data-theme", stored);
  else if (prefersDark) root.setAttribute("data-theme", "dark");

  themeToggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("ds-theme", next);
  });

  /* ---------- Year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Floating particles ---------- */
  const pWrap = document.getElementById("particles");
  if (pWrap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const COUNT = window.innerWidth < 760 ? 8 : 12;
    for (let i = 0; i < COUNT; i++) {
      const p = document.createElement("span");
      p.className = "particle";
      const size = Math.random() * 5 + 2;
      p.style.width = p.style.height = size + "px";
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDuration = (Math.random() * 12 + 10) + "s";
      p.style.animationDelay = (Math.random() * 12) + "s";
      pWrap.appendChild(p);
    }
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
    { name: "Aoi", note: "Sidr · Lavender · Olive", from: "#2d3a2e", to: "#1a1a1a", img: "assets/image-1.jpg", webp: "assets/image-1.webp" },
    { name: "Azure Mist", note: "Blue Tansy · Sea", from: "#cfe0f5", to: "#2A6FD6", img: "assets/image-2.jpg", webp: "assets/image-2.webp" },
    { name: "Kuro", note: "Coffee · Lemon · Lavender", from: "#c4a882", to: "#3d2b1f", img: "assets/image-3.jpg", webp: "assets/image-3.webp" },
    { name: "Hikari", note: "Oat · Lemon", from: "#f0e6d3", to: "#C8B078", img: "assets/image-4.jpg", webp: "assets/image-4.webp" }
  ];

  function soapSVG(from, to, label) {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='533'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0' stop-color='${from}'/><stop offset='1' stop-color='${to}'/>
        </linearGradient>
        <radialGradient id='sh' cx='0.35' cy='0.3' r='0.8'>
          <stop offset='0' stop-color='rgba(255,255,255,0.55)'/>
          <stop offset='0.5' stop-color='rgba(255,255,255,0)'/>
        </radialGradient>
        <filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncA type='linear' slope='0.06'/></feComponentTransfer><feComposite operator='over' in2='SourceGraphic'/></filter>
      </defs>
      <rect width='400' height='533' fill='url(#g)'/>
      <rect width='400' height='533' fill='url(#g)' filter='url(#n)'/>
      <rect width='400' height='533' fill='url(#sh)'/>
      <ellipse cx='200' cy='300' rx='150' ry='120' fill='rgba(255,255,255,0.10)'/>
      <circle cx='150' cy='200' r='60' fill='rgba(255,255,255,0.18)'/>
      <text x='200' y='500' font-family='Inter, sans-serif' font-size='14' letter-spacing='2' fill='rgba(255,255,255,0.55)' text-anchor='middle'>DIAMOND SOAP</text>
    </svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  const grid = document.getElementById("galleryGrid");
  products.forEach((p, i) => {
    const card = document.createElement("button");
    card.className = "gallery-card reveal";
    card.setAttribute("aria-label", "View " + p.name);
    card.style.transitionDelay = (i % 3) * 0.08 + "s";
    const img = document.createElement("img");
    img.className = "g-img";
    img.src = p.img;
    img.alt = p.name + " — " + p.note;
    img.width = 400;
    img.height = 533;
    img.loading = "lazy";
    img.decoding = "async";
    if (p.webp) {
      img.onerror = function() { this.onerror = null; this.src = p.img; };
      img.src = p.webp;
    }
    card.appendChild(img);
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

  function openLightbox(p) {
    const imgUrl = p.webp || p.img;
    lightboxImg.style.backgroundImage = `url("${imgUrl}")`;
    lightboxCap.innerHTML = `<span>${p.note}</span>${p.name}`;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

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
