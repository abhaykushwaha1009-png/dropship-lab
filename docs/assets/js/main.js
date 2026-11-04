(function () {
  "use strict";
  var cfg = window.CHECKOUT || {};
  function notice(el, msg) {
    var n = el.closest("section, .buy, body").querySelector(".notice");
    if (!n) { n = document.createElement("p"); n.className = "notice"; el.after(n); }
    n.textContent = msg;
    n.classList.add("on");
  }
  document.querySelectorAll("[data-buy]").forEach(function (btn) {
    btn.addEventListener("click", function (ev) {
      ev.preventDefault();
      var sku = btn.getAttribute("data-buy");
      var url = cfg[sku];
      if (url) { window.location.href = url; return; }
      btn.setAttribute("disabled", "true");
      btn.textContent = "Checkout connecting\u2026";
      notice(btn, "Checkout for this item is being connected right now. Message us and we ship the same day it opens.");
    });
  });
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  document.querySelectorAll("form.email-capture").forEach(function (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var msg = form.querySelector(".msg");
      if (!input || !input.value || input.value.indexOf("@") < 1) { return; }
      var list = [];
      try { list = JSON.parse(localStorage.getItem("dl_capture") || "[]"); } catch (e) {}
      list.push({ email: input.value, goal: location.pathname, t: Date.now() });
      localStorage.setItem("dl_capture", JSON.stringify(list.slice(-200)));
      input.value = "";
      if (msg) { msg.className = "msg ok"; msg.textContent = "You are on the list — one email when it restocks."; }
      try {
        window.__dlNotify && window.__dlNotify({ type: "capture", email: list[list.length - 1].email });
      } catch (e) {}
    });
  });
})();
