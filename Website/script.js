const body = document.body;

/* =========================
   CURSOR STATE
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

/* velocity tracking */
let prevX = 50;
let prevY = 50;

let velX = 0;
let velY = 0;

/* =========================
   FIELD LAYERS
========================= */

let midX = 50, midY = 50;
let fastX = 50, fastY = 50;

/* =========================
   TUNING
========================= */

const stiffness = 0.02;
const damping = 0.78;

const midStrength = 0.06;
const fastStrength = 0.12;

const distortionK = 0.002;

/* =========================
   UI ELEMENTS
========================= */

const sidenav = document.getElementById("sidenav");
const menuBtn = document.getElementById("menuBtn");

/* =========================
   SIDEBAR TOGGLE
========================= */

menuBtn.addEventListener("click", () => {
    sidenav.classList.toggle("open");
});

/* =========================
   INPUT SYSTEM
========================= */

document.addEventListener("mousemove", (e) => {
    targetX = (e.clientX / window.innerWidth) * 100;
    targetY = (e.clientY / window.innerHeight) * 100;
});

/* =========================
   PHYSICS UPDATE
========================= */

function updatePhysics() {
    const ax = (targetX - x) * stiffness;
    const ay = (targetY - y) * stiffness;

    vx = (vx + ax) * damping;
    vy = (vy + ay) * damping;

    x += vx;
    y += vy;

    velX = x - prevX;
    velY = y - prevY;

    prevX = x;
    prevY = y;
}

/* =========================
   FIELD UPDATE (PARALLAX)
========================= */

function updateFields() {
    midX += (targetX - midX) * midStrength;
    midY += (targetY - midY) * midStrength;

    fastX += (targetX - fastX) * fastStrength;
    fastY += (targetY - fastY) * fastStrength;
}

/* =========================
   DISTORTION FIELD
========================= */

function getDistortion() {
    const dx = targetX - x;
    const dy = targetY - y;

    const dist = Math.sqrt(dx * dx + dy * dy);
    const influence = 1 / (1 + distortionK * dist * dist);

    return {
        x: dx * influence * 0.15,
        y: dy * influence * 0.15
    };
}

/* =========================
   OUTPUT SYSTEM
========================= */

function render(bendX, bendY) {
    body.style.setProperty("--x", (x + bendX) + "%");
    body.style.setProperty("--y", (y + bendY) + "%");

    body.style.setProperty("--mx", (midX + bendX * 0.6) + "%");
    body.style.setProperty("--my", (midY + bendY * 0.6) + "%");

    body.style.setProperty("--fx", (fastX + bendX * 0.3) + "%");
    body.style.setProperty("--fy", (fastY + bendY * 0.3) + "%");
}

/* =========================
   MAIN LOOP
========================= */

function animate() {

    updatePhysics();
    updateFields();

    const { x: bendX, y: bendY } = getDistortion();

    render(bendX, bendY);

    requestAnimationFrame(animate);
}

animate();