// Background animation lights - Optimized
document.addEventListener("DOMContentLoaded", function () {
  const a = document.getElementById("background-animation");
  if (!a) return;
  const b = 6;
  for (let i = 0; i < b; i++) {
    const c = document.createElement("div");
    c.classList.add("light");
    const d = Math.random() * 100 + 150;
    c.style.width = d + "px";
    c.style.height = d + "px";
    const e = Math.random() * 100,
      f = Math.random() * 100;
    c.style.setProperty("--start-x", e + "vw");
    c.style.setProperty("--start-y", f + "vh");
    c.style.setProperty("--mid1-x", Math.random() * 100 + "vw");
    c.style.setProperty("--mid1-y", Math.random() * 100 + "vh");
    c.style.setProperty("--mid2-x", Math.random() * 100 + "vw");
    c.style.setProperty("--mid2-y", Math.random() * 100 + "vh");
    c.style.setProperty("--mid3-x", Math.random() * 100 + "vw");
    c.style.setProperty("--mid3-y", Math.random() * 100 + "vh");
    c.style.animationDuration = Math.random() * 10 + 20 + "s";
    a.appendChild(c);
  }
});
