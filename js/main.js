(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");

  // Header on scroll
  var header = document.querySelector(".header");
  function onScroll() { if (header) header.classList.toggle("scrolled", window.scrollY > 20); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  var btn = document.querySelector(".menu-btn");
  if (btn) {
    btn.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("menu-open");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  }

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reveal on scroll
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { ro.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // Play videos only while visible (saves data and battery)
  var vids = document.querySelectorAll("video[data-autoplay]");
  vids.forEach(function (v) { v.muted = true; v.setAttribute("muted", ""); });
  if ("IntersectionObserver" in window) {
    var vo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting && !reduce) {
          var p = v.play(); if (p && p.catch) p.catch(function () {});
        } else { v.pause(); }
      });
    }, { threshold: 0.25 });
    vids.forEach(function (v) { vo.observe(v); });
  }

  // Contact form -> WhatsApp (no data is stored on any server)
  var form = document.getElementById("wa-form");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (form.querySelector(".hp input").value) return; // bot
      var f = new FormData(form);
      var lines = [
        "Hola, vengo de la web de Velor Studios.",
        "Nombre: " + (f.get("nombre") || ""),
        "Negocio: " + (f.get("negocio") || ""),
        "Me interesa: " + (f.get("plan") || ""),
      ];
      var msg = (f.get("mensaje") || "").trim();
      if (msg) lines.push("Mensaje: " + msg);
      var url = "https://wa.me/34611066820?text=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank", "noopener");
    });
  }

  // Year
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
