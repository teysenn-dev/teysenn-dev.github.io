// --- Curseur personnalisé avec traînée ---
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

// Tableau pour stocker les éléments de traînée
const trails = [];
const maxTrails = 12;

// Création des éléments de traînée
for (let i = 0; i < maxTrails; i++) {
  const trail = document.createElement('div');
  trail.className = 'cursor-trail';
  trail.style.opacity = (1 - i / maxTrails) * 0.8;
  document.body.appendChild(trail);
  trails.push({
    element: trail,
    x: 0,
    y: 0
  });
}

// Position précédente de la souris
let lastX = 0;
let lastY = 0;

// Mise à jour de la position du curseur et de la traînée
document.addEventListener('mousemove', (e) => {
  // Mise à jour du curseur principal
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';

  // Calcul du mouvement
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  const speed = Math.sqrt(dx * dx + dy * dy);

  // Mise à jour des positions de la traînée
  for (let i = trails.length - 1; i > 0; i--) {
    trails[i].x = trails[i - 1].x;
    trails[i].y = trails[i - 1].y;
  }

  // Mise à jour de la première position de la traînée
  trails[0].x = lastX;
  trails[0].y = lastY;

  // Application des positions avec délai
  trails.forEach((trail, i) => {
    const scale = 1 - (i / trails.length) * 0.5;
    trail.element.style.left = trail.x + 'px';
    trail.element.style.top = trail.y + 'px';
    trail.element.style.transform = `translate(-50%, -50%) scale(${scale})`;
    trail.element.style.opacity = (1 - i / trails.length) * 0.8;
  });

  // Mise à jour de la dernière position
  lastX = e.clientX;
  lastY = e.clientY;
});

// Cache la traînée quand la souris quitte la fenêtre
document.addEventListener('mouseout', () => {
  trails.forEach(trail => {
    trail.element.style.opacity = '0';
  });
});

document.addEventListener('mouseover', () => {
  trails.forEach((trail, i) => {
    trail.element.style.opacity = (1 - i / trails.length) * 0.8;
  });
});

// Gestion des éléments interactifs
document.querySelectorAll('a, button, .badge').forEach(el => {
  el.classList.add('clickable');
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

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
  alpha: Math.random()*0.5+0.3,
  color: `hsl(${Math.random()*60+200}, 70%, 60%)`
}));

// Particules qui suivent la souris
let mouseTrail = [];
let lastMousePosition = { x: 0, y: 0 };

window.addEventListener('mousemove', e => {
  const dx = e.clientX - lastMousePosition.x;
  const dy = e.clientY - lastMousePosition.y;
  const speed = Math.sqrt(dx*dx + dy*dy);
  
  const count = Math.floor(speed/10) + 1;
  for(let i = 0; i < count; i++) {
    const ratio = i / count;
    mouseTrail.push({
      x: lastMousePosition.x + dx * ratio,
      y: lastMousePosition.y + dy * ratio,
      r: 7 + speed/20,
      alpha: 1,
      color: `hsl(${200 + speed}, 70%, 60%)`
    });
  }
  
  if (mouseTrail.length > 30) mouseTrail.splice(0, mouseTrail.length - 30);
  lastMousePosition = { x: e.clientX, y: e.clientY };
});

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Fond
  for (const p of particles) {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, 2*Math.PI);
    ctx.fillStyle = p.color;
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
    ctx.globalAlpha = t.alpha * (1 - i/mouseTrail.length);
    ctx.shadowColor = t.color;
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(t.x, t.y, t.r * (1 - i/mouseTrail.length), 0, 2*Math.PI);
    ctx.fillStyle = t.color;
    ctx.fill();
    ctx.restore();
    
    t.r *= 0.96;
    t.alpha *= 0.94;
  }
  
  mouseTrail = mouseTrail.filter(t => t.alpha > 0.05 && t.r > 0.5);
  requestAnimationFrame(drawParticles);
}

drawParticles();

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

// --- Animation de la description ---
const descriptions = [
  "Développeur, Sécurité & Réseaux",
  "CyberSécurité",
  "Joueur COD",
  "Linux enjoyer"
];

let typingElement = null;
let currentDescIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;

function typeText() {
  if (!typingElement) return;
  
  const currentDesc = descriptions[currentDescIndex];
  
  if (isDeleting) {
    typingElement.textContent = currentDesc.substring(0, currentCharIndex - 1);
    currentCharIndex--;
  } else {
    typingElement.textContent = currentDesc.substring(0, currentCharIndex + 1);
    currentCharIndex++;
  }

  if (!isDeleting && currentCharIndex === currentDesc.length) {
    isDeleting = true;
    setTimeout(typeText, 2000);
    return;
  }

  if (isDeleting && currentCharIndex === 0) {
    isDeleting = false;
    currentDescIndex = (currentDescIndex + 1) % descriptions.length;
    setTimeout(typeText, 500);
    return;
  }

  const typingSpeed = isDeleting ? 50 : 100;
  setTimeout(typeText, typingSpeed);
}

// --- Initialisation après chargement du DOM ---
window.addEventListener('DOMContentLoaded', () => {
  // Initialisation de l'audio
  const audio = document.getElementById('bg-music');
  const soundController = document.querySelector('.sound-controller');
  const soundToggle = document.querySelector('.sound-toggle');
  const volumeSlider = document.querySelector('.slider');
  const volumeIcon = soundToggle.querySelector('i');
  let isCollapsed = false;

  if (audio) {
    // Gestion du volume
    volumeSlider.addEventListener('input', (e) => {
      const volume = e.target.value / 100;
      audio.volume = volume;
      updateVolumeIcon(volume);
    });

    // Gestion du bouton mute
    soundToggle.addEventListener('click', () => {
      if (!isCollapsed) {
        audio.muted = !audio.muted;
        updateVolumeIcon(audio.muted ? 0 : volumeSlider.value / 100);
      }
      isCollapsed = !isCollapsed;
      soundController.classList.toggle('collapsed');
    });

    // Gestion de l'entrée/sortie de la souris
    soundController.addEventListener('mouseenter', () => {
      isCollapsed = false;
      soundController.classList.remove('collapsed');
    });

    soundController.addEventListener('mouseleave', () => {
      isCollapsed = true;
      soundController.classList.add('collapsed');
    });

    // Fonction pour mettre à jour l'icône du volume
    function updateVolumeIcon(volume) {
      volumeIcon.className = 'fas ' + 
        (volume === 0 ? 'fa-volume-mute' :
         volume < 0.3 ? 'fa-volume-off' :
         volume < 0.7 ? 'fa-volume-down' :
         'fa-volume-up');
    }

    // Initialisation du volume
    audio.volume = volumeSlider.value / 100;
    
    // Auto-collapse après 3 secondes
    setTimeout(() => {
      if (!isCollapsed) {
        isCollapsed = true;
        soundController.classList.add('collapsed');
      }
    }, 3000);

    // Gestion de l'autoplay
    audio.play().catch(() => {});
    const resumeAudio = () => {
      audio.play();
      window.removeEventListener('click', resumeAudio);
      window.removeEventListener('touchstart', resumeAudio);
    };
    window.addEventListener('click', resumeAudio);
    window.addEventListener('touchstart', resumeAudio);
  }

  // Initialisation de l'animation de description
  typingElement = document.querySelector('.typing-text');
  if (typingElement) {
    typeText();
  }
});
