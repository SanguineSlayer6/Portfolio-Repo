/* =========================
   CORE DOCUMENT REFERENCES
========================= */

const body = document.body;

const sidenav = document.getElementById("sidenav");
const menuBtn = document.getElementById("menuBtn");

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
   SIDEBAR TOGGLE SYSTEM
========================= */

if (menuBtn && sidenav) {

    menuBtn.addEventListener("click", () => {
        sidenav.classList.toggle("open");
    });

}

/* =========================
   NAVIGATION CONFIGURATION
========================= */

const pages = [

    { name: "Home",     url: "./index.html" },
    { name: "Projects", url: "./projects.html" },
    { name: "About Me", url: "./aboutme.html" },
    { name: "Contact",  url: "./contact.html" }

];

/* =========================
   PATH NORMALIZATION
========================= */

function normalizePath(path) {

    path = path.split("?")[0];

    path = path.split("#")[0];

    path = path.replace(/\/$/, "");

    path = path.toLowerCase();

    return path;

}

/* =========================
   GET CURRENT PAGE
========================= */

function getCurrentPage() {

    let path = window.location.pathname;

    let fileName = path.substring(path.lastIndexOf("/") + 1);

    if (fileName === "") {
        fileName = "index.html";
    }

    return normalizePath(fileName);

}

/* =========================
   BUILD SIDENAV
========================= */

function buildNav() {

    if (!sidenav) return;

    sidenav.innerHTML = "";

    const currentPage = getCurrentPage();

    const nav = document.createElement("nav");

    pages.forEach((page) => {

        const link = document.createElement("a");

        link.href = page.url;
        link.textContent = page.name;

        const pageFile = normalizePath(
            page.url.replace("./", "")
        );

        if (pageFile === currentPage) {
            link.classList.add("active");
        }

        nav.appendChild(link);

    });

    sidenav.appendChild(nav);

}

buildNav();

/* =========================
   FIELD SIMULATION LOOP
========================= */

function animate() {

    /* =========================
       SPRING PHYSICS
    ========================== */

    vx += (targetX - x) * stiffness;
    vy += (targetY - y) * stiffness;

    vx *= damping;
    vy *= damping;

    x += vx;
    y += vy;

    /* =========================
       SECONDARY FIELD LAYERS
    ========================== */

    midX += (targetX - midX) * midStrength;
    midY += (targetY - midY) * midStrength;

    fastX += (targetX - fastX) * fastStrength;
    fastY += (targetY - fastY) * fastStrength;

    /* =========================
       DISTORTION CALCULATION
    ========================== */

    const dx = targetX - x;
    const dy = targetY - y;

    const dist = Math.sqrt(dx * dx + dy * dy);

    const influence =
        1 / (1 + distortionK * dist * dist);

    const bendX = dx * influence * 0.15;
    const bendY = dy * influence * 0.15;

    /* =========================
       CSS VARIABLE OUTPUT
    ========================== */

    body.style.setProperty(
        "--x",
        (x + bendX) + "%"
    );

    body.style.setProperty(
        "--y",
        (y + bendY) + "%"
    );

    body.style.setProperty(
        "--mx",
        midX + "%"
    );

    body.style.setProperty(
        "--my",
        midY + "%"
    );

    body.style.setProperty(
        "--fx",
        fastX + "%"
    );

    body.style.setProperty(
        "--fy",
        fastY + "%"
    );

    requestAnimationFrame(animate);

}

/* =========================
   BOOT SEQUENCE
========================= */

animate();