window.addEventListener('DOMContentLoaded', () => {
  const card = document.querySelector('.profile-card');
  card.style.opacity = 0;
  card.style.transform += ' scale(0.95)';
  setTimeout(() => {
    card.style.transition = 'opacity 0.7s, transform 0.7s';
    card.style.opacity = 1;
    card.style.transform = 'translate(-50%, -50%) scale(1)';
  }, 100);

  // Pour l'autoplay sur mobile, on relance l'audio au premier clic
  const audio = document.getElementById('profile-audio');
  function playAudio() {
    audio.play();
    window.removeEventListener('click', playAudio);
    window.removeEventListener('touchstart', playAudio);
  }
  window.addEventListener('click', playAudio);
  window.addEventListener('touchstart', playAudio);

  // Compteur de vues simple avec LocalStorage
  const counterKey = 'profile-view-counter';
  let views = localStorage.getItem(counterKey);
  if (!views) {
    views = 1;
  } else {
    views = parseInt(views, 10) + 1;
  }
  localStorage.setItem(counterKey, views);
  document.getElementById('view-counter').textContent = views;

  // Effet tilt 3D sur la carte principale
  const mainCard = document.getElementById('main-card');
  mainCard.addEventListener('mousemove', (e) => {
    const rect = mainCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 14;
    mainCard.style.transform = `translate(-50%, -50%) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
  });
  mainCard.addEventListener('mouseleave', () => {
    mainCard.style.transform = 'translate(-50%, -50%) rotateX(0deg) rotateY(0deg)';
  });

  // Contrôle du volume
  const volumeSlider = document.getElementById('volume-slider');
  volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
  });

  // Flocons animés
  function createSnowflake() {
    const snowflake = document.createElement('span');
    snowflake.className = 'snowflake';
    snowflake.textContent = '❄';
    snowflake.style.left = Math.random() * 100 + 'vw';
    snowflake.style.fontSize = (Math.random() * 1.2 + 0.8) + 'rem';
    snowflake.style.animationDuration = (Math.random() * 2 + 3) + 's';
    document.getElementById('snowflakes').appendChild(snowflake);
    setTimeout(() => snowflake.remove(), 5000);
  }
  setInterval(createSnowflake, 400);

  // Lecteur audio custom
  const musicAudio = document.getElementById('profile-audio');
  const playBtn = document.getElementById('music-play');
  const prevBtn = document.getElementById('music-prev');
  const nextBtn = document.getElementById('music-next');
  const progressBar = document.getElementById('music-progress');
  const currentTimeEl = document.querySelector('.music-current-time');
  const durationEl = document.querySelector('.music-duration');
  const musicTitle = document.querySelector('.music-title');
  const musicArtist = document.querySelector('.music-artist');
  // Pour l'instant, une seule musique locale
  let isPlaying = false;
  playBtn.addEventListener('click', () => {
    if (musicAudio.paused) {
      musicAudio.play();
      isPlaying = true;
      playBtn.querySelector('img').src = 'assets/pause.svg';
    } else {
      musicAudio.pause();
      isPlaying = false;
      playBtn.querySelector('img').src = 'assets/play.svg';
    }
  });
  musicAudio.addEventListener('timeupdate', () => {
    progressBar.value = (musicAudio.currentTime / musicAudio.duration) * 100;
    currentTimeEl.textContent = formatTime(musicAudio.currentTime);
    durationEl.textContent = formatTime(musicAudio.duration);
  });
  progressBar.addEventListener('input', (e) => {
    musicAudio.currentTime = (e.target.value / 100) * musicAudio.duration;
  });
  function formatTime(sec) {
    if (isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
  // (prev/next inutiles ici mais prêts pour plusieurs musiques)

  // Discord RPC (structure prête)
  const DISCORD_ID = '1283319101095153705';
  async function updateDiscordCard() {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
    const data = await res.json();
    if (!data.success) return;
    const d = data.data;
    // Discord
    document.querySelector('.discord-avatar').src = `https://cdn.discordapp.com/avatars/${d.discord_user.id}/${d.discord_user.avatar}.png?size=128`;
    document.querySelector('.discord-username').textContent = d.discord_user.username;
    document.querySelector('.discord-status').textContent = d.discord_status === 'online' ? 'En ligne' : d.discord_status;
    // Activité
    let act = d.activities.find(a => a.type === 0);
    document.querySelector('.discord-activity').textContent = act ? act.name + (act.state ? ' - ' + act.state : '') : '';
    // Spotify
    if (d.listening_to_spotify && d.spotify) {
      document.querySelector('.music-cover').src = d.spotify.album_art_url;
      document.querySelector('.music-title').textContent = d.spotify.song;
      document.querySelector('.music-artist').textContent = d.spotify.artist;
      document.querySelector('.music-card').style.display = '';
    } else {
      document.querySelector('.music-card').style.display = 'none';
    }
  }
  updateDiscordCard();
  setInterval(updateDiscordCard, 10000);
}); 