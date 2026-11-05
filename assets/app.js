/* Batik Sayang proposal site — interaction layer.
   Business name is ONE swappable constant (BRAND_NAME).
   Every [data-brand] element carries the name as fallback text,
   so the site reads correctly even if this script fails. */
(function () {
  "use strict";

  var BRAND_NAME = "Batik Sayang";
  var IG_HANDLE = "batik_sayangsg";
  var IG_URL = "https://www.instagram.com/" + IG_HANDLE;

  document.documentElement.classList.remove("no-js");

  /* Fill brand slots from the single constant. */
  document.querySelectorAll("[data-brand]").forEach(function (el) {
    el.textContent = BRAND_NAME;
  });

  /* Mobile nav toggle. */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Menu";
      }
    });
  }

  /* Masked line-rise headlines + staggered reveals (rest state is
     visible without JS: .no-js overrides in CSS). */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".rise, .reveal, .hero-media .bloom").forEach(function (el) {
    io.observe(el);
  });

  /* Calendar day filters (calendar.html). */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var days = document.querySelectorAll(".timeline .day");
  if (filterBtns.length && days.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        btn.setAttribute("aria-pressed", "true");
        var f = btn.getAttribute("data-filter");
        days.forEach(function (day) {
          var kinds = (day.getAttribute("data-kind") || "").split(" ");
          day.hidden = !(f === "all" || kinds.indexOf(f) !== -1);
        });
      });
    });
  }

  /* Contact form — demo handler: no real submission, no data stored.
     Shows a success state and points to the real channel (IG DM). */
  var form = document.getElementById("intake-form");
  if (form) {
    var success = document.getElementById("form-success");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("f-name");
      var handle = document.getElementById("f-handle");
      var ok = true;
      [name, handle].forEach(function (field) {
        var err = document.getElementById(field.id + "-error");
        if (!field.value.trim()) {
          ok = false;
          field.setAttribute("aria-invalid", "true");
          if (err) err.textContent = "This field is required for the demo.";
        } else {
          field.removeAttribute("aria-invalid");
          if (err) err.textContent = "";
        }
      });
      if (!ok) return;
      form.querySelector("button[type=submit]").disabled = true;
      if (success) {
        success.classList.add("show");
        success.querySelector("a").href = IG_URL;
        success.focus();
      }
    });
  }

  /* Print button (privacy.html). */
  var printBtn = document.getElementById("print-copy");
  if (printBtn) printBtn.addEventListener("click", function () { window.print(); });
})();
