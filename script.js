window.addEventListener('DOMContentLoaded', () => {
  // --- Apparition animée de la carte principale ---
  const card = document.querySelector('.profile-card');
  if (card) {
    card.style.opacity = 0;
    card.style.transform += ' scale(0.95)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.7s, transform 0.7s';
      card.style.opacity = 1;
      card.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 100);
  }

  // --- Autoplay audio sur mobile ---
  const audio = document.getElementById('profile-audio');
  if (audio) {
    function playAudio() {
      audio.play();
      window.removeEventListener('click', playAudio);
      window.removeEventListener('touchstart', playAudio);
    }
    window.addEventListener('click', playAudio);
    window.addEventListener('touchstart', playAudio);
  }

  // --- Compteur de vues simple ---
  const counterKey = 'profile-view-counter';
  let views = localStorage.getItem(counterKey);
  if (!views) {
    views = 1;
  } else {
    views = parseInt(views, 10) + 1;
  }
  localStorage.setItem(counterKey, views);
  const viewCounter = document.getElementById('view-counter');
  if (viewCounter) viewCounter.textContent = views;

  // --- Effet tilt 3D sur la carte principale ---
  const mainCard = document.getElementById('main-card');
  if (mainCard) {
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
  }

  // --- Contrôle du volume ---
  const volumeSlider = document.getElementById('volume-slider');
  if (audio && volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      audio.volume = e.target.value;
    });
  }

  // --- Lecteur audio custom ---
  const musicAudio = document.getElementById('profile-audio');
  const playBtn = document.getElementById('music-play');
  const prevBtn = document.getElementById('music-prev');
  const nextBtn = document.getElementById('music-next');
  const progressBar = document.getElementById('music-progress');
  const currentTimeEl = document.querySelector('.music-current-time');
  const durationEl = document.querySelector('.music-duration');
  const musicTitle = document.querySelector('.music-title');
  const musicArtist = document.querySelector('.music-artist');
  if (musicAudio && playBtn && progressBar && currentTimeEl && durationEl) {
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
  }

  // --- Discord & Spotify via Lanyard ---
  const DISCORD_ID = '1283319101095153705';
  async function updateDiscordCard() {
    try {
      const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
      const data = await res.json();
      if (!data.success) return;
      const d = data.data;
      // Discord
      const discordAvatar = document.querySelector('.discord-avatar');
      const discordUsername = document.querySelector('.discord-username');
      const discordStatus = document.querySelector('.discord-status');
      const discordActivity = document.querySelector('.discord-activity');
      if (discordAvatar && d.discord_user.avatar)
        discordAvatar.src = `https://cdn.discordapp.com/avatars/${d.discord_user.id}/${d.discord_user.avatar}.png?size=128`;
      if (discordUsername) discordUsername.textContent = d.discord_user.username;
      if (discordStatus) discordStatus.textContent = d.discord_status === 'online' ? 'En ligne' : d.discord_status;
      // Activité
      let act = d.activities.find(a => a.type === 0);
      if (discordActivity) discordActivity.textContent = act ? act.name + (act.state ? ' - ' + act.state : '') : '';
      // Spotify
      const musicCard = document.querySelector('.music-card');
      if (d.listening_to_spotify && d.spotify) {
        if (musicCard) musicCard.style.display = '';
        const musicCover = document.querySelector('.music-cover');
        if (musicCover) musicCover.src = d.spotify.album_art_url;
        if (musicTitle) musicTitle.textContent = d.spotify.song;
        if (musicArtist) musicArtist.textContent = d.spotify.artist;
      } else {
        if (musicCard) musicCard.style.display = 'none';
      }
    } catch (e) { /* ignore fetch errors */ }
  }
  updateDiscordCard();
  setInterval(updateDiscordCard, 10000);
}); 