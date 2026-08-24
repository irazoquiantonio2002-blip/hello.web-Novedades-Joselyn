const loadingScreen = document.getElementById("loading-screen");
const header = document.getElementById("site-header");
const nav = document.getElementById("main-nav");
const navToggle = document.getElementById("nav-toggle");
const year = document.getElementById("year");
const typewriter = document.getElementById("typewriter");
const canvas = document.getElementById("particles-canvas");

window.addEventListener("load", () => {
  setTimeout(() => loadingScreen?.classList.add("is-hidden"), 450);
});

if (year) {
  year.textContent = new Date().getFullYear();
}

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 16);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  navToggle.classList.toggle("is-active", Boolean(isOpen));
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    nav?.classList.remove("is-open");
    navToggle?.classList.remove("is-active");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.05 }
);

document.querySelectorAll("[data-reveal]").forEach((element) => {
  revealObserver.observe(element);
});

const words = ["ropa casual", "mochilas", "articulos de cocina", "detalles para el hogar", "novedades utiles"];
let wordIndex = 0;
let letterIndex = 0;
let deleting = false;

function tickTypewriter() {
  if (!typewriter) return;

  const word = words[wordIndex];
  typewriter.textContent = word.slice(0, letterIndex);

  if (!deleting && letterIndex < word.length) {
    letterIndex += 1;
    setTimeout(tickTypewriter, 72);
    return;
  }

  if (!deleting && letterIndex === word.length) {
    deleting = true;
    setTimeout(tickTypewriter, 1300);
    return;
  }

  if (deleting && letterIndex > 0) {
    letterIndex -= 1;
    setTimeout(tickTypewriter, 38);
    return;
  }

  deleting = false;
  wordIndex = (wordIndex + 1) % words.length;
  setTimeout(tickTypewriter, 260);
}

tickTypewriter();

if (canvas) {
  const context = canvas.getContext("2d");
  const colors = ["#ec3f86", "#ffbf1f", "#28a96b", "#1298d5", "#ffffff"];
  let particles = [];

  function resizeCanvas() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    particles = Array.from({ length: Math.min(72, Math.floor(window.innerWidth / 18)) }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      speed: Math.random() * .45 + .12,
      drift: Math.random() * .4 - .2,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
  }

  function animateParticles() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach((particle) => {
      particle.y -= particle.speed;
      particle.x += particle.drift;

      if (particle.y < -10) {
        particle.y = window.innerHeight + 10;
        particle.x = Math.random() * window.innerWidth;
      }

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fillStyle = particle.color;
      context.globalAlpha = .6;
      context.fill();
    });
    context.globalAlpha = 1;
    requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  animateParticles();
  window.addEventListener("resize", resizeCanvas);
}
