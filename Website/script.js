const menuBtn = document.getElementById("menuBtn");
const sidenav = document.getElementById("sidenav");

menuBtn.addEventListener("click", () => {
    sidenav.classList.toggle("open");
});