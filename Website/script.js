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

let velocityX = 0;
let velocityY = 0;

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
   NAVIGATION CONFIGURATION
========================= */

const pages = [

    { name: "Home",     url: "./index.html" },
    { name: "Projects", url: "./projects.html" },
    { name: "About Me", url: "./aboutme.html" },
    { name: "Contact",  url: "./contact.html" }

];

/* =========================
   INPUT SYSTEM
========================= */

function updatePointerPosition(clientX, clientY) {

    targetX =
        (clientX / window.innerWidth) * 100;

    targetY =
        (clientY / window.innerHeight) * 100;
}

window.addEventListener("mousemove", (event) => {

    updatePointerPosition(
        event.clientX,
        event.clientY
    );
});

window.addEventListener(
    "touchmove",
    (event) => {

        const touch = event.touches[0];

        if (!touch) return;

        updatePointerPosition(
            touch.clientX,
            touch.clientY
        );
    },
    { passive: true }
);

window.addEventListener(
    "touchstart",
    (event) => {

        const touch = event.touches[0];

        if (!touch) return;

        updatePointerPosition(
            touch.clientX,
            touch.clientY
        );
    },
    { passive: true }
);

/* =========================
   SIDEBAR TOGGLE SYSTEM
========================= */

function toggleSidebar() {

    if (!sidenav) return;

    sidenav.classList.toggle("open");
}

if (menuBtn && sidenav) {

    menuBtn.addEventListener(
        "click",
        toggleSidebar
    );
}

/* =========================
   PATH NORMALIZATION
========================= */

function normalizePath(path) {

    return path
        .split("?")[0]
        .split("#")[0]
        .replace(/\/$/, "")
        .toLowerCase();
}

/* =========================
   GET CURRENT PAGE
========================= */

function getCurrentPage() {

    const path = window.location.pathname;

    let fileName =
        path.substring(
            path.lastIndexOf("/") + 1
        );

    if (fileName === "") {
        fileName = "index.html";
    }

    return normalizePath(fileName);
}

/* =========================
   BUILD SIDENAV
========================= */

function createNavLink(page, currentPage) {

    const link = document.createElement("a");

    link.href = page.url;
    link.textContent = page.name;

    const pageFile = normalizePath(
        page.url.replace("./", "")
    );

    if (pageFile === currentPage) {
        link.classList.add("active");
    }

    return link;
}

function buildNav() {

    if (!sidenav) return;

    sidenav.innerHTML = "";

    const currentPage = getCurrentPage();

    const nav = document.createElement("nav");

    pages.forEach((page) => {

        const link = createNavLink(
            page,
            currentPage
        );

        nav.appendChild(link);
    });

    sidenav.appendChild(nav);
}

buildNav();

/* =========================
   FIELD PHYSICS
========================= */

function updateSpringPhysics() {

    velocityX += (targetX - x) * stiffness;
    velocityY += (targetY - y) * stiffness;

    velocityX *= damping;
    velocityY *= damping;

    x += velocityX;
    y += velocityY;
}

/* =========================
   SECONDARY FIELD MOTION
========================= */

function updateFieldLayers() {

    midX +=
        (targetX - midX) * midStrength;

    midY +=
        (targetY - midY) * midStrength;

    fastX +=
        (targetX - fastX) * fastStrength;

    fastY +=
        (targetY - fastY) * fastStrength;
}

/* =========================
   DISTORTION CALCULATION
========================= */

function calculateDistortion() {

    const deltaX = targetX - x;
    const deltaY = targetY - y;

    const distance = Math.sqrt(
        deltaX * deltaX +
        deltaY * deltaY
    );

    const influence =
        1 / (
            1 +
            distortionK *
            distance *
            distance
        );

    return {

        bendX:
            deltaX *
            influence *
            0.15,

        bendY:
            deltaY *
            influence *
            0.15
    };
}

/* =========================
   CSS VARIABLE OUTPUT
========================= */

function updateCSSVariables(bendX, bendY) {

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
}

/* =========================
   FIELD SIMULATION LOOP
========================= */

function animate() {

    updateSpringPhysics();

    updateFieldLayers();

    const {
        bendX,
        bendY
    } = calculateDistortion();

    updateCSSVariables(
        bendX,
        bendY
    );

    requestAnimationFrame(animate);
}

/* =========================
   BOOT SEQUENCE
========================= */

animate();