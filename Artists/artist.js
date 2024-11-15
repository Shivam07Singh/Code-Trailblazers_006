const clientId = 'fe151298159341f891fdd90b8a69bf1b';
const clientSecret = '4112f4ca733b4ffca0dbee6fc06302dd';
let accessToken = '';

const artistList = document.getElementById('artistList');
const searchBar = document.getElementById('searchBar');
let favoriteArtists = JSON.parse(localStorage.getItem('favoriteArtists')) || [];

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
  fetchMohammedRafi(); // Fetch Mohammed Rafi as the default artist
}

async function fetchMohammedRafi() {
  try {
    const response = await fetch(`https://api.spotify.com/v1/search?q=Mohammed%20Rafi&type=artist&limit=1`, {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    });

    const data = await response.json();
    const artist = data.artists.items[0]; // Get the first artist result (Mohammed Rafi)
    displayArtists([artist]);
  } catch (error) {
    console.error('Failed to fetch Mohammed Rafi:', error);
    artistList.innerHTML = `<p>Failed to load Mohammed Rafi.</p>`;
  }
}

async function searchArtist() {
  const query = searchBar.value.trim().toLowerCase();
  if (!query) return;

  try {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=artist&limit=10`, {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    });
    const data = await response.json();
    displayArtists(data.artists.items);
  } catch (error) {
    console.error('Error fetching artists:', error);
    artistList.innerHTML = `<p>Failed to load search results.</p>`;
  }
}

function displayArtists(artists) {
  artistList.innerHTML = '';
  artists.forEach(artist => {
    const artistCard = document.createElement('div');
    artistCard.classList.add('artist-card');
    const isFavorite = favoriteArtists.some(fav => fav.id === artist.id);

    artistCard.innerHTML = `
      <img src="${artist.images[0]?.url || 'default-image.jpg'}" alt="${artist.name}">
      <h3>${artist.name}</h3>
      <p>Popularity: ${artist.popularity}</p>
      <p>Followers: ${artist.followers.total.toLocaleString()}</p>
      <p>Genres: ${artist.genres.join(', ') || 'N/A'}</p>
      <a href="${artist.external_urls.spotify}" target="_blank">View on Spotify</a>
      <span class="heart" data-id="${artist.id}" style="color: ${isFavorite ? 'red' : 'gray'};">&#x2764;</span>
    `;

    artistList.appendChild(artistCard);
  });

  document.querySelectorAll('.heart').forEach(heart => {
    heart.addEventListener('click', toggleFavoriteArtist);
  });
}

function toggleFavoriteArtist(event) {
  const artistId = event.target.dataset.id;
  const artistCard = event.target.closest('.artist-card');
  const artist = {
    id: artistId,
    name: artistCard.querySelector('h3').innerText,
    image: artistCard.querySelector('img').src,
    url: artistCard.querySelector('a').href
  };

  const index = favoriteArtists.findIndex(fav => fav.id === artistId);
  if (index >= 0) {
    favoriteArtists.splice(index, 1);
    event.target.style.color = 'gray';
  } else {
    favoriteArtists.push(artist);
    event.target.style.color = 'red';
  }

  localStorage.setItem('favoriteArtists', JSON.stringify(favoriteArtists));
  window.dispatchEvent(new Event('favoriteUpdated')); // Dispatch an event when favorites are updated
}

function openFavoritesPage() {
  window.open('favorites.html', '_blank');
}

searchBar.addEventListener('input', searchArtist);
getAccessToken();

// Listen for the "favoriteUpdated" event to update heart colors
window.addEventListener('favoriteUpdated', () => {
  document.querySelectorAll('.heart').forEach(heart => {
    const artistId = heart.dataset.id;
    const isFavorite = favoriteArtists.some(fav => fav.id === artistId);
    heart.style.color = isFavorite ? 'red' : 'gray';
  });
});
