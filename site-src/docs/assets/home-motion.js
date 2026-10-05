/* Homepage only. Fades and the shingle rails. Reduced motion leaves words still. */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) {
    document.documentElement.classList.add("js");
    var nodes = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      var seen = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            seen.unobserve(entry.target);
          }
        });
      }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
      nodes.forEach(function (node) { seen.observe(node); });
    } else {
      nodes.forEach(function (node) { node.classList.add("in"); });
    }
  }

  var behavior = reduce ? "auto" : "smooth";
  document.querySelectorAll("[data-rail]").forEach(function (rail) {
    var scroller = document.getElementById(rail.getAttribute("data-rail"));
    var back = rail.querySelector("[data-dir='-1']");
    var fwd = rail.querySelector("[data-dir='1']");
    if (!scroller || !back || !fwd) { return; }
    back.addEventListener("click", function () {
      scroller.scrollBy({ left: -scroller.clientWidth * 0.8, behavior: behavior });
    });
    fwd.addEventListener("click", function () {
      scroller.scrollBy({ left: scroller.clientWidth * 0.8, behavior: behavior });
    });
  });
}());
