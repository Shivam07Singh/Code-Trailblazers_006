const clientId = 'fe151298159341f891fdd90b8a69bf1b';
const clientSecret = '4112f4ca733b4ffca0dbee6fc06302dd';


const songContainer = document.getElementById('songContainer');
const sectionTitle = document.getElementById('sectionTitle');
let accessToken = '';
let currentAudio = null;

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
}

async function fetchSongs(query) {
  const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`, {
    headers: { 'Authorization': 'Bearer ' + accessToken }
  });
  const data = await response.json();
  displaySongs(data.tracks.items);
}

function displayTrendingSongs() {
  sectionTitle.textContent = 'Trending Songs';
  fetchSongs('top hits');
}

function displaySongs(songs) {
  songContainer.innerHTML = '';
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
        <div class="timer mt-1">0:00</div>
      </div>
    `;

    songContainer.appendChild(songCard);
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

document.getElementById('searchButton').addEventListener('click', () => {
  const query = document.getElementById('searchInput').value;
  if (query) {
    sectionTitle.textContent = 'Search Results';
    fetchSongs(query);
  } else {
    displayTrendingSongs();
  }
});

// Initial setup
getAccessToken();



// const songContainer = document.getElementById('songContainer');
// const sectionTitle = document.getElementById('sectionTitle');
// let accessToken = '';
// let currentAudio = null;

// async function getAccessToken() {
//   const response = await fetch('https://accounts.spotify.com/api/token', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
//     },
//     body: 'grant_type=client_credentials'
//   });
//   const data = await response.json();
//   accessToken = data.access_token;
//   displayTrendingSongs();
// }

// async function fetchSongs(query) {
//   const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`, {
//     headers: { 'Authorization': 'Bearer ' + accessToken }
//   });
//   const data = await response.json();
//   displaySongs(data.tracks.items);
// }

// function displayTrendingSongs() {
//   sectionTitle.textContent = 'Trending Songs';
//   fetchSongs('top hits');
// }

// function displaySongs(songs) {
//   songContainer.innerHTML = '';
//   songs.forEach(song => {
//     const songCard = document.createElement('div');
//     songCard.classList.add('song-card', 'p-4', 'shadow-lg');

//     songCard.innerHTML = `
//       <img src="${song.album.images[0].url}" alt="${song.name}">
//       <div class="song-info mt-2">
//         <div class="song-title font-bold">${song.name}</div>
//         <div class="song-artist text-sm text-gray-300">${song.artists[0].name}</div>
//         <button class="play-btn mt-2" data-preview="${song.preview_url}">Play</button>
//         <button class="pause-btn mt-2 hidden">Pause</button>
//         <button class="stop-btn mt-2 hidden">Stop</button>
//         <div class="timer mt-1">0:00</div>
//       </div>
//     `;

//     songContainer.appendChild(songCard);
//   });

//   setupPlaybackControls();
// }

// function setupPlaybackControls() {
//   const playButtons = document.querySelectorAll('.play-btn');
//   const pauseButtons = document.querySelectorAll('.pause-btn');
//   const stopButtons = document.querySelectorAll('.stop-btn');

//   playButtons.forEach((playBtn, index) => {
//     const pauseBtn = pauseButtons[index];
//     const stopBtn = stopButtons[index];
//     const previewUrl = playBtn.getAttribute('data-preview');
//     const timer = playBtn.nextElementSibling.nextElementSibling.nextElementSibling;

//     playBtn.addEventListener('click', () => {
//       if (currentAudio) currentAudio.pause();

//       currentAudio = new Audio(previewUrl);
//       currentAudio.play();

//       playBtn.classList.add('hidden');
//       pauseBtn.classList.remove('hidden');
//       stopBtn.classList.remove('hidden');

//       currentAudio.ontimeupdate = () => {
//         let minutes = Math.floor(currentAudio.currentTime / 60);
//         let seconds = Math.floor(currentAudio.currentTime % 60).toString().padStart(2, '0');
//         timer.textContent = `${minutes}:${seconds}`;
//       };

//       currentAudio.onended = () => {
//         resetButtons(playBtn, pauseBtn, stopBtn, timer);
//       };
//     });

//     pauseBtn.addEventListener('click', () => {
//       if (currentAudio) {
//         currentAudio.pause();
//         playBtn.classList.remove('hidden');
//         pauseBtn.classList.add('hidden');
//       }
//     });

//     stopBtn.addEventListener('click', () => {
//       if (currentAudio) {
//         currentAudio.pause();
//         currentAudio.currentTime = 0;
//         resetButtons(playBtn, pauseBtn, stopBtn, timer);
//       }
//     });
//   });
// }

// function resetButtons(playBtn, pauseBtn, stopBtn, timer) {
//   playBtn.classList.remove('hidden');
//   pauseBtn.classList.add('hidden');
//   stopBtn.classList.add('hidden');
//   timer.textContent = '0:00';
// }

// document.getElementById('searchButton').addEventListener('click', () => {
//   const query = document.getElementById('searchInput').value;
//   if (query) {
//     sectionTitle.textContent = 'Search Results';
//     fetchSongs(query);
//   } else {
//     displayTrendingSongs();
//   }
// });

// // Initial setup
// getAccessToken();



// const songContainer = document.getElementById('songContainer');
// const sectionTitle = document.getElementById('sectionTitle');
// let accessToken = '';
// let currentAudio = null;

// async function getAccessToken() {
//   const response = await fetch('https://accounts.spotify.com/api/token', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
//     },
//     body: 'grant_type=client_credentials'
//   });
//   const data = await response.json();
//   accessToken = data.access_token;
//   displayTrendingSongs();
// }

// async function fetchSongs(query) {
//   const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`, {
//     headers: { 'Authorization': 'Bearer ' + accessToken }
//   });
//   const data = await response.json();
//   displaySongs(data.tracks.items);
// }

// function displayTrendingSongs() {
//   sectionTitle.textContent = 'Trending Songs';
//   fetchSongs('top hits');
// }

// function displaySongs(songs) {
//   songContainer.innerHTML = '';
//   songs.forEach(song => {
//     const songCard = document.createElement('div');
//     songCard.classList.add('song-card');

//     songCard.innerHTML = `
//       <img src="${song.album.images[0].url}" alt="${song.name}">
//       <div class="song-info">
//         <div class="song-title">${song.name}</div>
//         <div class="song-artist">${song.artists[0].name}</div>
//         <button class="play-btn" data-preview="${song.preview_url}">Play</button>
//         <button class="stop-btn" style="display: none;">Stop</button>
//         <div class="timer">0:00</div>
//       </div>
//     `;

//     songContainer.appendChild(songCard);
//   });

//   setupPlayButtons();
// }

// function setupPlayButtons() {
//   const playButtons = document.querySelectorAll('.play-btn');
//   const stopButtons = document.querySelectorAll('.stop-btn');

//   playButtons.forEach((button, index) => {
//     button.addEventListener('click', (e) => {
//       const previewUrl = e.target.getAttribute('data-preview');

//       // Stop any currently playing audio
//       if (currentAudio) {
//         currentAudio.pause();
//         currentAudio = null;
//       }

//       const audio = new Audio(previewUrl);
//       currentAudio = audio;
//       const timer = e.target.nextElementSibling.nextElementSibling;

//       // Hide other stop buttons and reset play button labels
//       stopButtons.forEach(btn => btn.style.display = 'none');
//       playButtons.forEach(btn => btn.textContent = 'Play');

//       // Set up the new audio
//       e.target.textContent = 'Pause';
//       stopButtons[index].style.display = 'inline-block';
//       audio.play();

//       audio.ontimeupdate = () => {
//         let minutes = Math.floor(audio.currentTime / 60);
//         let seconds = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
//         timer.textContent = `${minutes}:${seconds}`;
//       };

//       audio.onended = () => {
//         e.target.textContent = 'Play';
//         stopButtons[index].style.display = 'none';
//         timer.textContent = '0:00';
//         currentAudio = null;
//       };

//       button.addEventListener('click', () => {
//         if (audio.paused) {
//           audio.play();
//           e.target.textContent = 'Pause';
//         } else {
//           audio.pause();
//           e.target.textContent = 'Play';
//         }
//       });

//       stopButtons[index].addEventListener('click', () => {
//         audio.pause();
//         audio.currentTime = 0;
//         e.target.textContent = 'Play';
//         stopButtons[index].style.display = 'none';
//         timer.textContent = '0:00';
//         currentAudio = null;
//       });
//     });
//   });
// }

// document.getElementById('searchButton').addEventListener('click', () => {
//   const query = document.getElementById('searchInput').value;
//   if (query) {
//     sectionTitle.textContent = 'Search Results';
//     fetchSongs(query);
//   } else {
//     displayTrendingSongs();
//   }
// });

// // Initial setup
// getAccessToken();




// const defaultSongs = document.getElementById('defaultSongs');
// const searchResults = document.getElementById('searchResults');
// const searchResultsTitle = document.getElementById('searchResultsTitle');
// const searchInput = document.getElementById('searchInput');
// const searchButton = document.getElementById('searchButton');

// searchResultsTitle.style.display = 'none';

// async function getToken() {
//   const result = await fetch('https://accounts.spotify.com/api/token', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
//     },
//     body: 'grant_type=client_credentials'
//   });
//   const data = await result.json();
//   return data.access_token;
// }

// async function fetchSongs(query) {
//   const token = await getToken();
//   const result = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`, {
//     method: 'GET',
//     headers: { 'Authorization': 'Bearer ' + token }
//   });
//   const data = await result.json();
//   return data.tracks.items;
// }

// async function loadDefaultSongs() {
//   const songs = await fetchSongs('trending'); // Fetch trending songs as default
//   displaySongs(songs, defaultSongs);
// }

// function displaySongs(songs, container) {
//   container.innerHTML = '';
//   songs.forEach(song => {
//     const songCard = document.createElement('div');
//     songCard.classList.add('song-card');
//     songCard.innerHTML = `
//       <img src="${song.album.images[0].url}" alt="${song.name}" class="song-image">
//       <div class="song-info">
//         <strong>${song.name}</strong><br>
//         ${song.artists[0].name}
//       </div>
//       <button class="play-button" onclick="playSong('${song.preview_url}', this)">Play</button>
//       <div class="timer" id="timer-${song.id}">0:00</div>
//     `;
//     container.appendChild(songCard);
//   });
// }

// async function searchSongs() {
//   const query = searchInput.value.trim();
//   if (!query) return;

//   const songs = await fetchSongs(query);
//   searchResultsTitle.style.display = 'block';
//   displaySongs(songs, searchResults);
// }

// let audio;
// let timerInterval;
// function playSong(previewUrl, button) {
//   if (audio) {
//     audio.pause();
//     clearInterval(timerInterval);
//   }

//   audio = new Audio(previewUrl);
//   audio.play();
//   button.innerText = 'Pause';
  
//   let seconds = 0;
//   const timerElement = button.nextElementSibling;
//   timerInterval = setInterval(() => {
//     seconds++;
//     const minutes = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     timerElement.innerText = `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
//   }, 1000);

//   audio.addEventListener('pause', () => {
//     button.innerText = 'Play';
//     clearInterval(timerInterval);
//   });

//   audio.addEventListener('ended', () => {
//     button.innerText = 'Play';
//     timerElement.innerText = '0:00';
//     clearInterval(timerInterval);
//   });
// }

// searchButton.addEventListener('click', searchSongs);
// loadDefaultSongs();




// async function getAccessToken() {
//     const response = await fetch('https://accounts.spotify.com/api/token', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//             'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
//         },
//         body: 'grant_type=client_credentials'
//     });
//     const data = await response.json();
//     return data.access_token;
// }

// async function fetchSongs(query) {
//     const token = await getAccessToken();
//     const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     });
//     const data = await response.json();
//     return data.tracks.items.map(track => ({
//         name: track.name,
//         artist: track.artists[0].name,
//         imageUrl: track.album.images[0]?.url || '',
//         previewUrl: track.preview_url
//     }));
// }


// async function searchSongs() {
//     const query = document.getElementById('searchInput').value;
//     const songSection = document.getElementById('songSection');
//     songSection.innerHTML = '';  // Clear previous results

//     const songs = await fetchSongs(query);
//     songs.forEach(song => {
//         const songCard = document.createElement('div');
//         songCard.classList.add('song-card');

//         songCard.innerHTML = `
//             <img src="${song.imageUrl}" alt="${song.name}">
//             <p class="song-title">${song.name}</p>
//             <p class="song-artist">${song.artist}</p>
//             <button class="play-button" onclick="playSong('${song.previewUrl}')">Play</button>
//         `;

//         songSection.appendChild(songCard);
//     });
// }

// function playSong(previewUrl) {
//     if (previewUrl) {
//         const audio = new Audio(previewUrl);
//         audio.play();
//     } else {
//         alert("Preview not available for this track.");
//     }
// }
