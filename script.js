// --- Particules qui suivent la souris ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Particules de fond classiques
const particles = Array.from({length: 48}, () => ({
  x: Math.random()*canvas.width,
  y: Math.random()*canvas.height,
  r: Math.random()*2.5+1.5,
  dx: (Math.random()-0.5)*0.5,
  dy: (Math.random()-0.5)*0.5,
  alpha: Math.random()*0.5+0.3
}));

// Particules qui suivent la souris
let mouseTrail = [];
window.addEventListener('mousemove', e => {
  mouseTrail.push({
    x: e.clientX,
    y: e.clientY,
    r: 7,
    alpha: 1
  });
  if (mouseTrail.length > 24) mouseTrail.shift();
});

function drawParticles() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // Fond
  for (const p of particles) {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, 2*Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.restore();
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  }
  // Traînée de la souris
  for (let i = 0; i < mouseTrail.length; i++) {
    const t = mouseTrail[i];
    ctx.save();
    ctx.globalAlpha = t.alpha * (1 - i / mouseTrail.length);
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.r, 0, 2*Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.restore();
    t.r *= 0.96;
    t.alpha *= 0.93;
  }
  mouseTrail = mouseTrail.filter(t => t.alpha > 0.05 && t.r > 0.5);
  requestAnimationFrame(drawParticles);
}
drawParticles();

// --- Effet typewriter ---
const typewriter = document.getElementById('typewriter');
const text = "Bienvenue sur mon profil guns.lol !";
let i = 0;
function type() {
  if (i <= text.length) {
    typewriter.textContent = text.slice(0, i);
    i++;
    setTimeout(type, 60);
  }
}
type();

// --- Carte 3D tilt ---
const card = document.getElementById('profile-card');
card.addEventListener('mousemove', e => {
  const rect = card.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  card.style.transform = `translate(-50%, -50%) perspective(1000px) rotateY(${x*16}deg) rotateX(${-y*16}deg) scale3d(1.03,1.03,1.03)`;
});
card.addEventListener('mouseleave', () => {
  card.style.transform = 'translate(-50%, -50%) perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
}); 