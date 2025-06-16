// === Discord & Spotify Live (Lanyard) ===
const DISCORD_ID = '1283319101095153705';
async function updateDiscordProfile() {
  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
    const data = await res.json();
    if (!data.success) return;
    const d = data.data;
    // Photo de profil
    const avatar = document.querySelector('.profile-pic-discord');
    if (avatar && d.discord_user.avatar)
      avatar.src = `https://cdn.discordapp.com/avatars/${d.discord_user.id}/${d.discord_user.avatar}.png?size=128`;
    // Pseudo
    const username = document.querySelector('.username-discord');
    if (username) username.textContent = d.discord_user.username;
    // Statut
    const status = document.querySelector('.status-discord');
    if (status) status.textContent = d.discord_status === 'online' ? 'En ligne' : d.discord_status;
    // Activité
    const activity = document.querySelector('.activity-discord');
    let act = d.activities.find(a => a.type === 0);
    if (activity) activity.textContent = act ? act.name + (act.state ? ' - ' + act.state : '') : '';
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

// === Particules qui suivent la souris ===
const cursorParticles = document.getElementById('cursor-particles');
const PARTICLE_COLOR = '#7f5fff';
function spawnCursorParticle(x, y) {
  const p = document.createElement('div');
  p.className = 'cursor-particle';
  p.style.left = x + 'px';
  p.style.top = y + 'px';
  p.style.background = PARTICLE_COLOR;
  cursorParticles.appendChild(p);
  setTimeout(() => { p.style.opacity = 0; }, 600);
  setTimeout(() => { p.remove(); }, 1200);
}
document.addEventListener('mousemove', e => {
  spawnCursorParticle(e.clientX, e.clientY);
});

// === (Prévu) Injection de logos CSS dans .social-logos ===
// À compléter selon les besoins
