// === Variables globales ===
const DISCORD_ID = '1283319101095153705';
let audio = document.getElementById('background-audio');
let viewCount = localStorage.getItem('viewCount') || 0;

// === Initialisation ===
document.addEventListener('DOMContentLoaded', () => {
  // Incrémenter le compteur de vues
  viewCount = parseInt(viewCount) + 1;
  localStorage.setItem('viewCount', viewCount);
  document.getElementById('view-count').textContent = viewCount;

  // Initialiser l'audio
  if (!audio) {
    audio = document.createElement('audio');
    audio.id = 'background-audio';
    audio.src = 'assets/music.mp3';
    audio.loop = true;
    document.body.appendChild(audio);
  }

  // Initialiser les effets
  setupTilt3D('.profile-card');
  setupTilt3D('.discord-info-col');
  setupVolumeControl();
  setupParticles();
  setupCursorParticles();
  setupSpotifyControls();
  
  // Mettre à jour le profil Discord
  updateDiscordProfile();
  setInterval(updateDiscordProfile, 10000);
});

// === Animation tilt 3D sur la carte principale et la colonne Discord ===
function setupTilt3D(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y - rect.height / 2) / rect.height) * 16;
    const ry = ((x - rect.width / 2) / rect.width) * 16;
    el.style.setProperty('--rx', `${-rx}deg`);
    el.style.setProperty('--ry', `${ry}deg`);
    el.classList.add('tilt');
  });
  el.addEventListener('mouseleave', () => {
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.classList.remove('tilt');
  });
}

// === Volume bouton/slider ===
function setupVolumeControl() {
  const volumeSlider = document.getElementById('volume-slider');
  const volumeBtn = document.getElementById('volume-btn');

  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      audio.volume = e.target.value;
    });
  }

  if (volumeBtn) {
    volumeBtn.addEventListener('click', () => {
      audio.muted = !audio.muted;
      volumeBtn.classList.toggle('muted');
      volumeBtn.querySelector('.volume-icon').innerHTML = audio.muted ? 
        '<path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' :
        '<path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.54 8.46C16.4774 9.39764 17.004 10.6692 17.004 11.995C17.004 13.3208 16.4774 14.5924 15.54 15.53M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    });
  }
}

// === Particules dynamiques sur canvas ===
function setupParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let w = window.innerWidth;
  let h = window.innerHeight;
  
  canvas.width = w;
  canvas.height = h;

  window.addEventListener('resize', () => {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
  });

  const PARTICLE_COUNT = 48;
  const particles = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2.5 + 1.5,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.5 + 0.3
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, w, h);
    
    for (const p of particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.shadowColor = '#fff';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.restore();

      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > w) p.dx *= -1;
      if (p.y < 0 || p.y > h) p.dy *= -1;
    }

    requestAnimationFrame(drawParticles);
  }

  drawParticles();
}

// === Particules type flocon/étoile qui suivent la souris ===
function setupCursorParticles() {
  const cursorParticles = document.getElementById('cursor-particles');

  function spawnCursorParticle(x, y) {
    const p = document.createElement('span');
    p.className = 'particle-flake';
    p.textContent = '✦';
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    cursorParticles.appendChild(p);

    setTimeout(() => {
      p.style.opacity = '0';
    }, 700);

    setTimeout(() => {
      p.remove();
    }, 1500);
  }

  document.addEventListener('mousemove', (e) => {
    spawnCursorParticle(e.clientX, e.clientY);
  });
}

// === Contrôles Spotify ===
function setupSpotifyControls() {
  const spotifyInfo = document.querySelector('.spotify-info');
  const playBtn = document.querySelector('.spotify-btn.play');
  
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      const isPlaying = playBtn.classList.toggle('playing');
      playBtn.querySelector('svg').innerHTML = isPlaying ?
        '<path d="M6 4H10V20H6V4ZM14 4H18V20H14V4Z" fill="currentColor"/>' :
        '<path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>';
    });
  }
}

// === Discord Live (Lanyard) ===
async function updateDiscordProfile() {
  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
    const data = await res.json();
    
    if (!data.success) return;
    
    const d = data.data;
    
    // Photo de profil
    document.querySelectorAll('.profile-pic-discord').forEach(img => {
      if (d.discord_user.avatar) {
        img.src = `https://cdn.discordapp.com/avatars/${d.discord_user.id}/${d.discord_user.avatar}.png?size=128`;
      }
    });

    // Pseudo
    document.querySelectorAll('.username-discord').forEach(el => {
      el.textContent = d.discord_user.username;
    });

    // Statut
    document.querySelectorAll('.status-discord').forEach(el => {
      el.textContent = d.discord_status === 'online' ? 'En ligne' : d.discord_status;
    });

    // Activité
    let act = d.activities.find(a => a.type === 0);
    document.querySelectorAll('.activity-discord').forEach(el => {
      el.textContent = act ? (act.name + (act.state ? ' - ' + act.state : '')) : '-';
    });

    // Spotify
    const spotify = d.activities.find(a => a.name === 'Spotify');
    const spotifyInfo = document.querySelector('.spotify-info');
    
    if (spotify && spotifyInfo) {
      spotifyInfo.style.display = 'flex';
      spotifyInfo.querySelector('.spotify-cover').src = spotify.assets.large_image;
      spotifyInfo.querySelector('.spotify-title').textContent = spotify.details;
      spotifyInfo.querySelector('.spotify-artist').textContent = spotify.state;
    } else if (spotifyInfo) {
      spotifyInfo.style.display = 'none';
    }

    // Badges
    const badgesDiv = document.querySelector('.badges');
    if (badgesDiv && d.discord_user.public_flags_array) {
      badgesDiv.innerHTML = '';
      d.discord_user.public_flags_array.forEach(flag => {
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.title = flag;
        badge.textContent = flag[0];
        badgesDiv.appendChild(badge);
      });
    }
  } catch (e) {
    console.error('Erreur lors de la mise à jour du profil Discord:', e);
  }
}

// === Bonus : animation logo SVG au hover (JS, si besoin) ===
// (Déjà géré par le CSS, mais on peut ajouter une classe .active sur hover si besoin)
document.querySelectorAll('.social-btn').forEach(btn => {
  btn.addEventListener('mouseenter', () => btn.classList.add('active'));
  btn.addEventListener('mouseleave', () => btn.classList.remove('active'));
});
