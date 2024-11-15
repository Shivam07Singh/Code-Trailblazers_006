const favoriteList = document.getElementById('favoriteList');
let favoriteArtists = JSON.parse(localStorage.getItem('favoriteArtists')) || [];

function displayFavoriteArtists() {
  favoriteList.innerHTML = '';

  if (favoriteArtists.length === 0) {
    favoriteList.innerHTML = "<p>No favorite artists found.</p>";
    return;
  }

  favoriteArtists.forEach(artist => {
    const artistCard = document.createElement('div');
    artistCard.classList.add('artist-card');

    artistCard.innerHTML = `
      <img src="${artist.image}" alt="${artist.name}">
      <h3>${artist.name}</h3>
      <a href="${artist.url}" target="_blank">View on Spotify</a>
      <button class="remove-btn" data-id="${artist.id}">Remove</button>
    `;

    favoriteList.appendChild(artistCard);
  });

  document.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', removeFavoriteArtist);
  });
}

function removeFavoriteArtist(event) {
  const artistId = event.target.dataset.id;
  favoriteArtists = favoriteArtists.filter(artist => artist.id !== artistId);
  localStorage.setItem('favoriteArtists', JSON.stringify(favoriteArtists));
  displayFavoriteArtists();
  window.opener.dispatchEvent(new Event('favoriteUpdated')); // Notify the artist page to update heart colors
}

displayFavoriteArtists();
