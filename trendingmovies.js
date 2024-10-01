
const trendingmoviebtns= document.getElementById('unique-movies-grid');
const trendingmovieleftbutton = document.getElementById('trendingmovie-left-button');
const trendingmovierightbutton = document.getElementById('trendingmovie-right-button');

// Scroll left
trendingmovieleftbutton.addEventListener('click', () => {
trendingmoviebtns.scrollBy({ left: -300, behavior: 'smooth' });
});

// Scroll right
trendingmovierightbutton.addEventListener('click', () => {
  trendingmoviebtns.scrollBy({ left: 300, behavior: 'smooth' });
});
const apiKey = process.env.TMDB_KEY; // Replace with your TMDB API key
        const uniqueMoviesGrid = document.getElementById('unique-movies-grid');
        let allMovies = []; // To store all fetched movies

        document.addEventListener('DOMContentLoaded', fetchTrendingMovies);

        function fetchTrendingMovies() {
            const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&append_to_response=credits`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    allMovies = data.results;
                    displayMovies(allMovies); // Display all movies
                })
                .catch(error => console.error('Error fetching movies:', error));
        }

        function displayMovies(movies) {
            movies.forEach(movie => {
                const genres = movie.genre_ids.map(id => getUniqueGenreName(id)).join(', ');
                const movieCard = document.createElement('div');
                movieCard.classList.add('unique-movie-flip-card');

                movieCard.innerHTML = `
                    <div class="unique-movie-card-inner">
                        <div class="unique-movie-front">
                            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                        </div>
                        <div class="unique-movie-back">
                            <h3>${movie.title} [${new Date(movie.release_date).getFullYear()}]</h3>
                            <p>Rating ⭐️: ${movie.vote_average} / 10</p>
                            <p>${movie.vote_average} based on ${movie.vote_count} user ratings</p>
                            <p>Release Info: ${movie.release_date}</p>
                            <p>Genre: ${genres}</p>
                            <p>Story Line: ${movie.overview}</p>
                            <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank">Read More</a>
                        </div>
                    </div>
                `;

                uniqueMoviesGrid.appendChild(movieCard);

                // Add flip effect on click
                movieCard.addEventListener('click', () => {
                    movieCard.classList.toggle('flip');
                });
            });
        }

        // Utility function to convert genre IDs to names
        function getUniqueGenreName(id) {
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