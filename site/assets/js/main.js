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
      if (btn.getAttribute("href")) return; // live affiliate link in href: let the browser follow it
      btn.setAttribute("disabled", "true");
      btn.textContent = "Checkout connecting\u2026";
      notice(btn, "Checkout for this item is being connected right now. Message us and we ship the same day it opens.");
    });
  });
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* build-a-kit: tick items, running total, and the Amazon search follows the ticks */
  var kit = document.querySelector("[data-add-kit]");
  var items = document.querySelectorAll("[data-kit-item]");
  var summary = document.querySelector("[data-kit-summary]");
  function gbp(v) { return "\u00a3" + v.toFixed(2); }
  function syncKit() {
    var on = [].filter.call(items, function (i) { return i.checked; });
    var total = on.reduce(function (a, i) { return a + Number(i.getAttribute("data-kit-price") || 0); }, 0);
    if (summary) summary.textContent = on.length ? on.length + " item" + (on.length > 1 ? "s" : "") + " \u00b7 " + gbp(total) + " \u2014 tick what you want." : "Nothing ticked yet.";
    if (!kit) return;
    if (!on.length) { kit.setAttribute("aria-disabled", "true"); return; }
    kit.removeAttribute("aria-disabled");
    var q = on.map(function (i) { return i.getAttribute("data-kit-name"); }).join(" ");
    kit.setAttribute("href", "https://www.amazon.co.uk/s?k=" + encodeURIComponent(q) + "&tag=" + (cfg.tag || "dropship-lab-21"));
  }
  [].forEach.call(items, function (i) { i.addEventListener("change", syncKit); });
  if (items.length) syncKit();

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
