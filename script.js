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
}); 