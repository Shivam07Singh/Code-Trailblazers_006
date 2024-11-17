const clientId = 'fe151298159341f891fdd90b8a69bf1b';
const clientSecret = '4112f4ca733b4ffca0dbee6fc06302dd';

const songContainer = document.getElementById('songContainer');
const bollyContainer = document.getElementById('bollyContainer');
const favoritesContainer = document.getElementById('favoritesContainer');
let accessToken = '';
let currentAudio = null;
let currentTimer = null;
let favoriteSongs = []; // Array to hold favorite songs

async function getAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
    },
    body: 'grant_type=client_credentials'
  });
  const data = await response.json();
  accessToken = data.access_token;
  displayTrendingSongs();
  displayTopBollywoodSong();
}

async function fetchSongs(query, container) {
  const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`, {
    headers: { 'Authorization': 'Bearer ' + accessToken }
  });
  const data = await response.json();
  displaySongs(data.tracks.items, container);
}

function displayTrendingSongs() {
  const sectionTitle = document.getElementById('sectionTitle');
  sectionTitle.textContent = 'Trending Songs';
  fetchSongs('top hits', songContainer);
}

function displayTopBollywoodSong() {
  const bollyTitle = document.getElementById('bollyTitle');
  bollyTitle.textContent = 'Top Bollywood Songs';
  fetchSongs('Bollywood', bollyContainer);
}

function displaySongs(songs, container) {
  container.innerHTML = '';
  songs.forEach(song => {
    const songCard = document.createElement('div');
    songCard.classList.add('song-card');

    songCard.innerHTML = `
      <img src="${song.album.images[0].url}" alt="${song.name}">
      <div class="song-info mt-2">
        <div class="song-title font-bold">${song.name}</div>
        <div class="song-artist text-sm text-gray-300">${song.artists[0].name}</div>
        <button class="play-btn mt-2" data-preview="${song.preview_url}">Play</button>
        <button class="pause-btn mt-2 hidden">Pause</button>
        <button class="stop-btn mt-2 hidden">Stop</button>
        <button class="favorite-btn mt-2">⭐</button>
        <div class="timer mt-1">0:00</div>
      </div>
    `;
    
    songCard.querySelector('.favorite-btn').addEventListener('click', () => {
      addToFavorites(song);
    });

    container.appendChild(songCard);
  });

  setupPlaybackControls();
}

function addToFavorites(song) {
  if (!favoriteSongs.some(favSong => favSong.id === song.id)) {
    favoriteSongs.push(song);
    displayFavorites();
  }
}

function displayFavorites() {
  favoritesContainer.innerHTML = '';
  favoriteSongs.forEach(song => {
    const favoriteCard = document.createElement('div');
    favoriteCard.classList.add('song-card');

    favoriteCard.innerHTML = `
      <img src="${song.album.images[0].url}" alt="${song.name}">
      <div class="song-info mt-2">
        <div class="song-title font-bold">${song.name}</div>
        <div class="song-artist text-sm text-gray-300">${song.artists[0].name}</div>
        <button class="play-btn mt-2" data-preview="${song.preview_url}">Play</button>
        <button class="pause-btn mt-2 hidden">Pause</button>
        <button class="stop-btn mt-2 hidden">Stop</button>
        <div class="timer mt-1">0:00</div>
      </div>
    `;

    favoritesContainer.appendChild(favoriteCard);
  });

  setupPlaybackControls();
}

function setupPlaybackControls() {
  const playButtons = document.querySelectorAll('.play-btn');
  const pauseButtons = document.querySelectorAll('.pause-btn');
  const stopButtons = document.querySelectorAll('.stop-btn');

  playButtons.forEach((playBtn, index) => {
    const pauseBtn = pauseButtons[index];
    const stopBtn = stopButtons[index];
    const previewUrl = playBtn.getAttribute('data-preview');
    const timer = playBtn.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling;

    playBtn.addEventListener('click', () => {
      if (currentAudio) currentAudio.pause();
      if (currentTimer) clearInterval(currentTimer);

      currentAudio = new Audio(previewUrl);
      currentAudio.play();

      playBtn.classList.add('hidden');
      pauseBtn.classList.remove('hidden');
      stopBtn.classList.remove('hidden');

      currentTimer = setInterval(() => {
        if (currentAudio) {
          const minutes = Math.floor(currentAudio.currentTime / 60);
          const seconds = Math.floor(currentAudio.currentTime % 60).toString().padStart(2, '0');
          timer.textContent = `${minutes}:${seconds}`;
        }
      }, 1000);

      currentAudio.onended = () => {
        resetButtons(playBtn, pauseBtn, stopBtn, timer);
      };
    });

    pauseBtn.addEventListener('click', () => {
      if (currentAudio) {
        currentAudio.pause();
        playBtn.classList.remove('hidden');
        pauseBtn.classList.add('hidden');
      }
    });

    stopBtn.addEventListener('click', () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        resetButtons(playBtn, pauseBtn, stopBtn, timer);
      }
    });
  });
}

function resetButtons(playBtn, pauseBtn, stopBtn, timer) {
  playBtn.classList.remove('hidden');
  pauseBtn.classList.add('hidden');
  stopBtn.classList.add('hidden');
  timer.textContent = '0:00';
  if (currentTimer) clearInterval(currentTimer);
}

document.getElementById('searchButton').addEventListener('click', () => {
  const query = document.getElementById('searchInput').value;
  const sectionTitle = document.getElementById('sectionTitle');
  if (query) {
    sectionTitle.textContent = 'Search Results';
    fetchSongs(query, songContainer);
  } else {
    displayTrendingSongs();
  }
});

// Initial setup
getAccessToken();
