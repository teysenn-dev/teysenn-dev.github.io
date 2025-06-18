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
