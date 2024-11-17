const clientId = 'fe151298159341f891fdd90b8a69bf1b';
const clientSecret = '4112f4ca733b4ffca0dbee6fc06302dd';

const songContainer1 = document.getElementById('songContainer1');
const sectionTitle1 = document.getElementById('sectionTitle1');
let accessToken = '';
let currentAudio = null;

async function getAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
    },
    body: 'grant_type=client_credentials',
  });
  const data = await response.json();
  accessToken = data.access_token;
  displayTrendingSongs();
}

async function fetchSongs(query) {
  const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=20`, {
    headers: { Authorization: 'Bearer ' + accessToken },
  });
  const data = await response.json();
  displaySongs(data.tracks.items);
}

function displayTrendingSongs() {
  sectionTitle1.textContent = 'Trending Songs';
  fetchSongs('top hits');
}

function displaySongs(songs) {
  songContainer1.innerHTML = '';
  songs.forEach((song) => {
    const songCard = document.createElement('div');
    songCard.classList.add('song-card1');

    songCard.innerHTML = `
      <img src="${song.album.images[0].url}" alt="${song.name}">
      <div class="song-info1 mt-2">
        <div class="song-title1 font-bold">${song.name}</div>
        <div class="song-artist1 text-sm text-gray-300">${song.artists[0].name}</div>
        <button class="play-btn1 mt-2" data-preview="${song.preview_url}">Play</button>
        <button class="pause-btn1 mt-2 hidden">Pause</button>
        <button class="stop-btn1 mt-2 hidden">Stop</button>
        <div class="timer1 mt-1">0:00</div>
      </div>
    `;

    songContainer1.appendChild(songCard);
  });

  setupPlaybackControls();
}

function setupPlaybackControls() {
  const playButtons = document.querySelectorAll('.play-btn1');
  const pauseButtons = document.querySelectorAll('.pause-btn1');
  const stopButtons = document.querySelectorAll('.stop-btn1');

  playButtons.forEach((playBtn, index) => {
    const pauseBtn = pauseButtons[index];
    const stopBtn = stopButtons[index];
    const previewUrl = playBtn.getAttribute('data-preview');
    const timer = playBtn.nextElementSibling.nextElementSibling.nextElementSibling;

    playBtn.addEventListener('click', () => {
      if (currentAudio) currentAudio.pause();

      currentAudio = new Audio(previewUrl);
      currentAudio.play();

      playBtn.classList.add('hidden');
      pauseBtn.classList.remove('hidden');
      stopBtn.classList.remove('hidden');

      currentAudio.ontimeupdate = () => {
        let minutes = Math.floor(currentAudio.currentTime / 60);
        let seconds = Math.floor(currentAudio.currentTime % 60).toString().padStart(2, '0');
        timer.textContent = `${minutes}:${seconds}`;
      };

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
}

document.getElementById('searchButton1').addEventListener('click', () => {
  const query = document.getElementById('searchInput1').value;
  if (query) {
    sectionTitle1.textContent = 'Search Results';
    fetchSongs(query);
  } else {
    displayTrendingSongs();
  }
});

// Initial setup
getAccessToken();
