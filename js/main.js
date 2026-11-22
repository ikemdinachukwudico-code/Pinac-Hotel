
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".hamburger");
  const links = document.querySelector(".nav-links");
  if (btn) btn.addEventListener("click", () => links.classList.toggle("open"));
  document.querySelectorAll(".nav-links a").forEach(a =>
    a.addEventListener("click", () => links.classList.remove("open")));
  const yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
});
