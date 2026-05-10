const body = document.body;

/* =========================
   CURSOR STATE SYSTEM
========================= */

let targetX = 50;
let targetY = 50;

/* =========================
   PHYSICS STATE
========================= */

let x = 50;
let y = 50;

let vx = 0;
let vy = 0;

let prevX = 50;
let prevY = 50;

/* =========================
   FIELD LAYERS
========================= */

let midX = 50;
let midY = 50;

let fastX = 50;
let fastY = 50;

/* =========================
   SIMULATION PARAMETERS
========================= */

const stiffness = 0.02;
const damping = 0.78;

const midStrength = 0.06;
const fastStrength = 0.12;

const distortionK = 0.002;

/* =========================
   INPUT SYSTEM
========================= */

document.addEventListener("mousemove", (e) => {
    targetX = (e.clientX / window.innerWidth) * 100;
    targetY = (e.clientY / window.innerHeight) * 100;
});

/* =========================
   UI SYSTEM (SIDEBAR)
========================= */

const sidenav = document.getElementById("sidenav");
const menuBtn = document.getElementById("menuBtn");

if (menuBtn && sidenav) {
    menuBtn.addEventListener("click", () => {
        sidenav.classList.toggle("open");
    });
}

/* =========================
   NAVIGATION SYSTEM
========================= */

const pages = [
    { name: "Home", url: "/Portfolio-Repo/Website/index.html" },
    { name: "Projects", url: "/projects.html" },
    { name: "About Me", url: "/aboutme.html" },
    { name: "Contact", url: "/contact.html" }
];

function getCurrentPath() {
    let path = window.location.pathname;

    if (path === "/" || path === "") {
        path = "/index.html";
    }

    return path;
}

function buildNav() {
    if (!sidenav) return;

    sidenav.innerHTML = "";

    const currentPath = getCurrentPath();

    const nav = document.createElement("nav");

    pages.forEach((page) => {
        const link = document.createElement("a");

        link.href = page.url;
        link.textContent = page.name;

        if (page.url === currentPath) {
            link.classList.add("active");
        }

        nav.appendChild(link);
    });

    sidenav.appendChild(nav);
}

buildNav();

/* =========================
   PHYSICS + FIELD SIMULATION
========================= */

function animate() {

    /* =========================
       CORE SPRING MOTION
    ========================== */

    vx += (targetX - x) * stiffness;
    vy += (targetY - y) * stiffness;

    vx *= damping;
    vy *= damping;

    x += vx;
    y += vy;

    /* =========================
       FIELD LAYERS
    ========================== */

    midX += (targetX - midX) * midStrength;
    midY += (targetY - midY) * midStrength;

    fastX += (targetX - fastX) * fastStrength;
    fastY += (targetY - fastY) * fastStrength;

    /* =========================
       DISTORTION FIELD
    ========================== */

    const dx = targetX - x;
    const dy = targetY - y;

    const dist = Math.sqrt(dx * dx + dy * dy);

    const influence = 1 / (1 + distortionK * dist * dist);

    const bendX = dx * influence * 0.15;
    const bendY = dy * influence * 0.15;

    /* =========================
       OUTPUT TO CSS VARIABLES
    ========================== */

    body.style.setProperty("--x", (x + bendX) + "%");
    body.style.setProperty("--y", (y + bendY) + "%");

    body.style.setProperty("--mx", midX + "%");
    body.style.setProperty("--my", midY + "%");

    body.style.setProperty("--fx", fastX + "%");
    body.style.setProperty("--fy", fastY + "%");

    requestAnimationFrame(animate);
}

/* =========================
   BOOT SYSTEM
========================= */

animate();