(function () {
  "use strict";
  var PHONE = "918760444693";
  var EMAIL = "sidharthasethupathy@sethulawfirm.in";

  /* ---- Current year ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---- Mobile menu ---- */
  var toggle = document.querySelector(".menu-toggle");
  var links = document.getElementById("nav-links");
  function setMenu(open) {
    links.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  toggle.addEventListener("click", function () { setMenu(!links.classList.contains("open")); });
  links.addEventListener("click", function (e) { if (e.target.tagName === "A") setMenu(false); });

  /* ---- Disclaimer (Bar Council) ---- */
  var modal = document.getElementById("disclaimer");
  function agreed() {
    try { if (localStorage.getItem("DisclaimerAgreed") === "true") return true; } catch (e) {}
    return document.cookie.indexOf("DisclaimerAgreed=true") !== -1;
  }
  function showModal() {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
    document.getElementById("agree").focus();
  }
  document.getElementById("agree").addEventListener("click", function () {
    try { localStorage.setItem("DisclaimerAgreed", "true"); } catch (e) {}
    document.cookie = "DisclaimerAgreed=true; max-age=31536000; path=/; SameSite=Lax";
    modal.classList.remove("show");
    document.body.style.overflow = "";
  });
  document.getElementById("show-disclaimer").addEventListener("click", showModal);
  if (!agreed()) showModal();

  /* ---- Image slider ---- */
  var track = document.querySelector(".slides");
  if (track) {
    var slides = track.children, n = slides.length, cur = 0, timer;
    var dots = document.querySelector(".dots");
    for (var i = 0; i < n; i++) {
      var b = document.createElement("button");
      b.setAttribute("aria-label", "Slide " + (i + 1));
      b.addEventListener("click", (function (k) { return function () { go(k); restart(); }; })(i));
      dots.appendChild(b);
    }
    function go(k) {
      cur = (k + n) % n;
      track.style.transform = "translateX(" + (-100 * cur) + "%)";
      for (var j = 0; j < n; j++) dots.children[j].setAttribute("aria-current", j === cur ? "true" : "false");
    }
    function restart() {
      clearInterval(timer);
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) timer = setInterval(function () { go(cur + 1); }, 5000);
    }
    document.querySelector(".slider-btn.prev").addEventListener("click", function () { go(cur - 1); restart(); });
    document.querySelector(".slider-btn.next").addEventListener("click", function () { go(cur + 1); restart(); });
    // swipe on touch screens
    var sx = null;
    track.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) { go(cur + (dx < 0 ? 1 : -1)); restart(); }
      sx = null;
    });
    go(0); restart();
  }

  /* ---- Reveal on scroll ---- */
  var els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Enquiry form → WhatsApp / Email ---- */
  var form = document.getElementById("enquiry");
  var via = "whatsapp";
  form.querySelectorAll("button[data-via]").forEach(function (btn) {
    btn.addEventListener("click", function () { via = btn.getAttribute("data-via"); });
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var err = form.querySelector(".form-error");
    var f = form.elements;
    var name = f["name"].value.trim(), phone = f["phone"].value.trim();
    var type = f["type"].value, msg = f["message"].value.trim();
    if (!name || !msg) { err.textContent = "Please enter your name and a brief description."; return; }
    err.textContent = "";
    var text = "Hello, I would like to consult Advocate Sidhartha Sethupathy.\n\n" +
      "Name: " + name + "\n" + (phone ? "Phone: " + phone + "\n" : "") +
      "Matter: " + type + "\n\n" + msg;
    track_("enquiry_" + via);
    if (via === "email") {
      location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Consultation enquiry – " + type) +
        "&body=" + encodeURIComponent(text);
    } else {
      window.open("https://wa.me/" + PHONE + "?text=" + encodeURIComponent(text), "_blank", "noopener");
    }
  });

  /* ---- Analytics events for calls / WhatsApp / email clicks ---- */
  function track_(name) { if (typeof gtag === "function") gtag("event", name); }
  document.querySelectorAll("[data-track]").forEach(function (a) {
    a.addEventListener("click", function () { track_(a.getAttribute("data-track")); });
  });
})();
