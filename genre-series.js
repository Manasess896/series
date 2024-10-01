
const seriesgenrebtn= document.getElementById('series-genre');
const seriesgenreleftbtn = document.getElementById('seriesgenreleftbtn');
const seriesgenrerightbtn = document.getElementById('seriesgenrerightbtn');

// Scroll left
seriesgenreleftbtn.addEventListener('click', () => { 
    seriesgenrebtn.scrollBy({ left: -300, behavior: 'smooth' });
});

// Scroll right
seriesgenrerightbtn.addEventListener('click', () => {
 seriesgenrebtn.scrollBy({ left: 300, behavior: 'smooth' });
});
const apitmdb =process.env.TMDB_KEY;  // Replace with your TMDB API key
const seriesgenre = document.getElementById('series-genre'); // Container for series
let page1 = 1; // To handle endless scrolling
let seriesGenre = ''; // Keep track of the current genre
let isLoading = false; // Flag to prevent multiple fetches

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.genre-button');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      seriesGenre = button.dataset.genre;
      page1 = 1;
      seriesgenre.innerHTML = ''; // Clear existing series content
      fetchSeriesByGenre(seriesGenre, page1);
    });
  });
});

window.addEventListener('scroll', () => {
  if (!isLoading && window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    // Load more content when scrolling to the bottom
    fetchSeriesByGenre(seriesGenre, ++page1);
  }
});

function fetchSeriesByGenre(genre, page) {
  const tvUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${apitmdb}&with_genres=${genre}&page=${page}`;

  isLoading = true; // Set loading flag

  fetch(tvUrl)
    .then(response => response.json())
    .then(tvData => {
      if (tvData.results.length === 0) {
        seriesgenre.innerHTML = `<p>No series found.</p>`;
      } else {
        tvData.results.forEach(serie => {
          fetchSeriesDetails(serie.id); // Fetch and display series details directly
        });
      }
    })
    .catch(error => console.error('Error fetching series:', error))
    .finally(() => isLoading = false); // Reset loading flag
}

function fetchSeriesDetails(seriesId) {
  const detailsUrl = `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${apitmdb}&language=en-US`;

  fetch(detailsUrl)
    .then(response => response.json())
    .then(details => {
      displaySeries(details);
    })
    .catch(error => console.error(`Error fetching details for series with ID ${seriesId}:`, error));
}

function displaySeries(serie) {
  const genres = serie.genres.map(genre => genre.name).join(', ');
  const title = serie.name;
  const releaseDate = serie.first_air_date || 'N/A';
  const runtime = serie.episode_run_time && serie.episode_run_time.length > 0
    ? `${serie.episode_run_time[0]} min`
    : 'N/A';
  const language = serie.original_language ? serie.original_language.toUpperCase() : 'N/A';
  const popularity = serie.popularity ? serie.popularity.toFixed(1) : 'N/A';
  const numberOfSeasons = serie.number_of_seasons || 'N/A';
  const numberOfEpisodes = serie.number_of_episodes || 'N/A';

  const seriesCard = document.createElement('div');
  seriesCard.classList.add('genre-movie-flip-card');

  const posterImage = serie.poster_path ?
 
    `<img src="https://image.tmdb.org/t/p/w500${serie.poster_path}" alt="${title}">` :
    '<div class="no-image">No Image Available</div>';

  seriesCard.innerHTML = `
    <div class="genre-movie-card-inner">
      <div class="genre-movie-front">
       <p class="title">Title:${title} [${new Date(releaseDate).getFullYear()}]</p>
        ${posterImage}
      </div>
      <div class="genre-movie-back">
        <h3 style"color:red">Title:${title} [${new Date(releaseDate).getFullYear()}]</h3>
        <p style="color:yellow">Rating ⭐️: ${serie.vote_average} / 10</p>
        <p>${serie.vote_average} based on ${serie.vote_count} user ratings</p>
        <p>Release Info: ${releaseDate}</p>
        <p style="color:blue">Genre: ${genres}</p>
        <p>Runtime: ${runtime}</p>
        <p>Language: ${language}</p>
        <p>Popularity: ${popularity}</p>
        <p>Seasons: ${numberOfSeasons}</p>
        <p>Episodes: ${numberOfEpisodes}</p>
        <p>Story Line: ${serie.overview}</p>
        <a href="https://www.themoviedb.org/tv/${serie.id}" target="_blank">Read More</a>
      </div>
    </div>
  `;

  seriesgenre.appendChild(seriesCard);

  seriesCard.addEventListener('click', () => {
    seriesCard.classList.toggle('genre-flip');
  });
}
function getGenreName(id) {
    const genreMap = {
        28: 'Action',
        12: 'Adventure',
        16: 'Animation',
        35: 'Comedy',
        80: 'Crime',
        99: 'Documentary',
        18: 'Drama',
        10751: 'Family',
        14: 'Fantasy',
        36: 'History',
        27: 'Horror',
        10402: 'Music',
        9648: 'Mystery',
        10749: 'Romance',
        878: 'Science Fiction',
        10770: 'TV Movie',
        53: 'Thriller',
        10752: 'War',
        37: 'Western',
    };
    return genreMap[id] || 'Unknown';
}