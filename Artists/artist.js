// Sample artist data
const artists = [
    {
      name: "Sonu Nigam",
      genres: ["Pop", "Dance pop"],
      imageUrl: "image/01.jpg",
      spotifyUrl: "https://open.spotify.com/artist/6eUKZXaKkcviwAqL9H2fJY"
    },
    {
      name: "Arijit Singh",
      genres: ["Rock", "Alternative"],
      imageUrl: "image/02.jpg",
      spotifyUrl: "https://open.spotify.com/artist/4bzMuIu5Uscpo25P5rsE5h"
    },
    {
      name: "Shreya Ghoshal",
      genres: ["Pop", "Dance pop"],
      imageUrl: "image/03.jpg",
      spotifyUrl: "https://open.spotify.com/artist/3jOxdN8PAm0aJNSrRjX9RP"
    },
    {
      name: "Lata Mangeshkar",
      genres: ["Hip-Hop", "Pop rap"],
      imageUrl: "image/04.jpg",
      spotifyUrl: "https://open.spotify.com/artist/0hUwwbdq4YzmHkWh8zWznK"
    },
    {
      name: "Atif Aslam",
      genres: ["Alternative", "Indie pop"],
      imageUrl: "image/05.jpg",
      spotifyUrl: "https://open.spotify.com/artist/4rOoJ6Egrf8K2IrywzwOMk"
    },
    {
      name: "Asha Bhosle",
      genres: ["Pop", "R&B"],
      imageUrl: "image/06.jpg",
      spotifyUrl: "https://open.spotify.com/artist/66CXWjxzVfMYer4mA1mXG9"
    },
    {
      name: "Kishore Kumar",
      genres: ["Pop", "Country"],
      imageUrl: "image/07.jpg",
      spotifyUrl: "https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02"
    },
    {
      name: "Kumar Sanu",
      genres: ["Pop", "Alternative"],
      imageUrl: "image/08.jpg",
      spotifyUrl: "https://open.spotify.com/artist/6XyY86QPM2jH1cR1p2n1fM"
    },
    {
      name: "Mohd Rafi",
      genres: ["Hip-Hop", "Rap"],
      imageUrl: "image/09.jpg",
      spotifyUrl: "https://open.spotify.com/artist/3TVXtAsR1Inumwj472S9r4"
    },
    {
      name: "Jubin Nautiyal",
      genres: ["K-Pop", "Pop"],
      imageUrl: "image/10.jpg",
      spotifyUrl: "https://open.spotify.com/artist/3NrfpX0o6x7K3K1K7lUjx1"
    },
    {
        name: "Rihanna",
        genres: ["Hip-Hop", "Rap"],
        imageUrl: "image/11.jpg",
        spotifyUrl: "https://open.spotify.com/artist/3TVXtAsR1Inumwj472S9r4"
      },
      {
        name: "Michael Jackson",
        genres: ["K-Pop", "Pop"],
        imageUrl: "image/12.jpg",
        spotifyUrl: "https://open.spotify.com/artist/3NrfpX0o6x7K3K1K7lUjx1"
      }
  ];
  
  // Function to display artists on the page
  function displayArtists(artistArray) {
    const artistList = document.getElementById('artistList');
    artistList.innerHTML = ''; // Clear the current list
  
    artistArray.forEach(artist => {
      const artistCard = document.createElement('div');
      artistCard.classList.add('artist-card');
      
      artistCard.innerHTML = `
        <img src="${artist.imageUrl}" alt="${artist.name}">
        <h3>${artist.name}</h3>
        <p>Genres: ${artist.genres.join(', ')}</p>
        <a href="${artist.spotifyUrl}" target="_blank">View on Spotify</a>
      `;
  
      artistList.appendChild(artistCard);
    });
  }
  
  // Function to search artists by name
  function searchArtist() {
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    const filteredArtists = artists.filter(artist => 
      artist.name.toLowerCase().includes(searchTerm)
    );
    displayArtists(filteredArtists);
  }
  
  // Initial display of all artists
  displayArtists(artists);
  