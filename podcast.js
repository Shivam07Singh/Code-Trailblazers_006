// Select all podcast elements, audio player, and audio player container
const podcasts = document.querySelectorAll('.podcast');
const audioPlayer = document.getElementById('audioPlayer');
const audioPlayerContainer = document.querySelector('.audio-player-container');
const searchInput = document.getElementById('searchInput');
const searchButton = document.querySelector('.search-bar button'); // Select the search button

// Function to play the selected podcast audio
function playPodcast(audioUrl) {
    audioPlayer.src = audioUrl;
    audioPlayer.play();
    audioPlayerContainer.style.display = "block"; // Show the audio player container
}

// Add event listeners to each podcast item to play audio on click
podcasts.forEach(podcast => {
    podcast.addEventListener('click', () => {
        const audioUrl = podcast.getAttribute('data-audio');
        playPodcast(audioUrl);
    });
});

// Filter podcasts based on search input
function filterPodcasts() {
    const query = searchInput.value.toLowerCase();

    podcasts.forEach(podcast => {
        const title = podcast.getAttribute('data-title').toLowerCase();
        if (title.includes(query)) {
            podcast.style.display = "flex"; // Show matching podcasts
        } else {
            podcast.style.display = "none"; // Hide non-matching podcasts
        }
    });
}

// Trigger filtering when search button is clicked
searchButton.addEventListener('click', filterPodcasts);

// Hide player when audio ends
audioPlayer.addEventListener("ended", () => {
    audioPlayerContainer.style.display = "none";
});
