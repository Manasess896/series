const moviesgenrebtn= document.getElementById('movies-genre');
const moviesgenreleftbtn = document.getElementById('moviesgenreleftbtn');
const moviesgenrerightbtn = document.getElementById('moviesgenrerightbtn');

// Scroll left
moviesgenreleftbtn.addEventListener('click', () => { 
    moviesgenrebtn.scrollBy({ left: -300, behavior: 'smooth' });
});

// Scroll right
moviesgenrerightbtn.addEventListener('click', () => {
 moviesgenrebtn.scrollBy({ left: 300, behavior: 'smooth' });
});
const apiKeytmdb ='d6e256dc1cc661c0bf793767a74948df'; // Replace with your TMDB API key
const moviegenre = document.getElementById('movies-genre'); // Container for movies
let page2 = 1; // To handle endless scrolling
let currentGenre = ''; // Keep track of the current genre

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.genre-button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            currentGenre = button.dataset.genre;
            page2 = 1;
            moviegenre.innerHTML = ''; // Clear existing movie content
            fetchMoviesByGenre(currentGenre, page2);
        });
    });
});

window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        // Load more content when scrolling to the bottom
        fetchMoviesByGenre(currentGenre, ++page2);
    }
});

function fetchMoviesByGenre(genre, page2) {
    const movieUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKeytmdb}&with_genres=${genre}&page2=${page2}`;
    
    fetch(movieUrl)
        .then(response => response.json())
        .then(moviesData => {
            displayMovies2(moviesData.results);
        })
        .catch(error => console.error('Error fetching movies:', error));
}

function displayMovies2(movies) {
    if (!movies || movies.length === 0) {
        moviegenre.innerHTML = `<p>No movies found.</p>`;
        return;
    }

    movies.forEach(movie => {
        const genres = movie.genre_ids.map(id => getGenreName(id)).join(', ');
        const title = movie.title;
        const releaseDate = movie.release_date || 'N/A';
        const runtime = movie.runtime || 'N/A';
        const language = movie.original_language ? movie.original_language.toUpperCase() : 'N/A';
        const popularity = movie.popularity ? movie.popularity.toFixed(1) : 'N/A';

        const movieCard = document.createElement('div');
        movieCard.classList.add('genre-movie-flip-card');

        const posterImage = movie.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${title}">`
            : '<div class="no-image">No Image Available</div>';

        movieCard.innerHTML = `
            <div class="genre-movie-card-inner">
                <div class="genre-movie-front">
  <p class="title">${title} [${new Date(releaseDate).getFullYear<\p>
                    ${posterImage}
                </div>
                <div class="genre-movie-back">
                    <h3>${title} [${new Date(releaseDate).getFullYear()}]</h3>
                    <p>Rating ⭐️: ${movie.vote_average} / 10</p>
                    <p>${movie.vote_average} based on ${movie.vote_count} user ratings</p>
                    <p>Release Info: ${releaseDate}</p>
                    <p>Genre: ${genres}</p>
                    <p>Runtime: ${runtime}</p>
                    <p>Language: ${language}</p>
                    <p>Popularity: ${popularity}</p>
                    <p>Story Line: ${movie.overview}</p>
                    <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank">Read More</a>
                </div>
            </div>
        `;

        moviegenre.appendChild(movieCard);

        movieCard.addEventListener('click', () => {
            movieCard.classList.toggle('genre-flip');
        });
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
