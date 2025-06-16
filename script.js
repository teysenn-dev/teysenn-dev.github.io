// === Animation tilt 3D sur la carte principale ===
const mainCard = document.getElementById('main-card');
if (mainCard) {
  mainCard.addEventListener('mousemove', (e) => {
    const rect = mainCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y - rect.height / 2) / rect.height) * 16;
    const ry = ((x - rect.width / 2) / rect.width) * 16;
    mainCard.style.setProperty('--rx', `${-rx}deg`);
    mainCard.style.setProperty('--ry', `${ry}deg`);
    mainCard.classList.add('tilt');
  });
  mainCard.addEventListener('mouseleave', () => {
    mainCard.style.setProperty('--rx', '0deg');
    mainCard.style.setProperty('--ry', '0deg');
    mainCard.classList.remove('tilt');
  });
}

// === Volume bouton/slider ===
const volumeSlider = document.getElementById('volume-slider');
const volumeBtn = document.getElementById('volume-btn');
let audio = document.getElementById('background-audio');
if (!audio) {
  audio = document.createElement('audio');
  audio.id = 'background-audio';
  audio.src = 'assets/music.mp3'; // à personnaliser
  audio.loop = true;
  audio.autoplay = true;
  document.body.appendChild(audio);
}
if (volumeSlider) {
  volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
  });
}
if (volumeBtn) {
  volumeBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    volumeBtn.classList.toggle('muted', audio.muted);
  });
}

// === Discord & Spotify Live (Lanyard) ===
const DISCORD_ID = '1283319101095153705';
async function updateDiscordProfile() {
  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
    const data = await res.json();
    if (!data.success) return;
    const d = data.data;
    // Photo de profil
    document.querySelectorAll('.profile-pic-discord').forEach(img => {
      if (d.discord_user.avatar)
        img.src = `https://cdn.discordapp.com/avatars/${d.discord_user.id}/${d.discord_user.avatar}.png?size=128`;
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
      el.textContent = act ? act.name + (act.state ? ' - ' + act.state : '') : '';
    });
    // Badges
    const badgesDiv = document.querySelector('.badges');
    if (badgesDiv) {
      badgesDiv.innerHTML = '';
      if (d.discord_user.public_flags_array) {
        d.discord_user.public_flags_array.forEach(flag => {
          const badge = document.createElement('span');
          badge.className = 'badge';
          badge.title = flag;
          badge.textContent = flag[0]; // Première lettre, à personnaliser
          badgesDiv.appendChild(badge);
        });
      }
    }
    // Spotify
    const spotifyDiv = document.querySelector('.spotify-info');
    if (d.listening_to_spotify && d.spotify) {
      if (spotifyDiv) spotifyDiv.style.display = '';
      const spotifyCover = document.querySelector('.spotify-cover');
      if (spotifyCover) spotifyCover.src = d.spotify.album_art_url;
      const spotifyTitle = document.querySelector('.spotify-title');
      if (spotifyTitle) spotifyTitle.textContent = d.spotify.song;
      const spotifyArtist = document.querySelector('.spotify-artist');
      if (spotifyArtist) spotifyArtist.textContent = d.spotify.artist;
    } else {
      if (spotifyDiv) spotifyDiv.style.display = 'none';
    }
  } catch (e) { /* ignore fetch errors */ }
}
updateDiscordProfile();
setInterval(updateDiscordProfile, 10000);

// === Injection logos CSS dans les boutons réseaux ===
// (Logos déjà en HTML via .logo-...)

// === Particules type flocon/étoile qui suivent la souris ===
const cursorParticles = document.getElementById('cursor-particles');
function spawnCursorParticle(x, y) {
  const p = document.createElement('span');
  p.className = 'particle-flake';
  p.textContent = '✦';
  p.style.left = x + 'px';
  p.style.top = y + 'px';
  cursorParticles.appendChild(p);
  setTimeout(() => { p.style.opacity = 0; }, 700);
  setTimeout(() => { p.remove(); }, 1500);
}
document.addEventListener('mousemove', e => {
  spawnCursorParticle(e.clientX, e.clientY);
});
