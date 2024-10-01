
                    document.addEventListener('DOMContentLoaded', function () {
                        const tmdbApiKey =process.env.TMDB_KEY; // Replace with your TMDb API key
                        const omdbApiKey = 'ffe8b9b0'; // Replace with your OMDb API key
                        const tmdbMovieListContainer = document.getElementById('tmdb-movie-list');
                        const omdbMovieListContainer = document.getElementById('omdb-movie-list');
                        const uniqueMovieSearchBar = document.getElementById('unique-movie-search-bar');
                        const uniqueMovieSearchBtn = document.getElementById('unique-movie-search-btn');
                        const clearBtn = document.getElementById('clear-btn');
                    
                        // Fetch TMDb results for various content types
                        async function fetchUniqueTMDbMovies(query) {
                            const url = `https://api.themoviedb.org/3/search/multi?api_key=${tmdbApiKey}&query=${encodeURIComponent(query)}`;
                            try {
                                const response = await fetch(url);
                                const data = await response.json();
                                return data.results;
                            } catch (error) {
                                console.error('Fetch error:', error);
                                return [];
                            }
                        }
                    
                        // Fetch OMDb results for movies, series, etc.
                        async function fetchUniqueOMDbMovies(query) {
                            const url = `https://www.omdbapi.com/?apikey=${omdbApiKey}&s=${encodeURIComponent(query)}&type=series`;
                            try {
                                const response = await fetch(url);
                                const data = await response.json();
                                return data.Search || [];
                            } catch (error) {
                                console.error('Fetch error:', error);
                                return [];
                           }
                        }
                    
                        // Display movie details with flip effect
                        function displayUniqueMovieDetails(movie, source, container) {
                            const genres = movie.genres ? movie.genres.map(genre => `#${genre.name}`).join(' ') : 'N/A';
                            const movieElement = document.createElement('div');
                            movieElement.className = 'unique-movie-item';
                    
                            const cardElement = document.createElement('div');
                            cardElement.className = 'unique-movie-card';
                    
                            // Front side with movie image
                            const frontElement = document.createElement('div');
                            frontElement.className = 'unique-movie-front';
                            frontElement.innerHTML = `
                                <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : movie.Poster}" alt="${movie.title || movie.Title}">
                            `;
                    
                            // Back side with movie details
                            const backElement = document.createElement('div');
                            backElement.className = 'unique-movie-back';
                            backElement.innerHTML = `
                                <div class="unique-movie-info">
                                    <h2>${movie.title || movie.Title} [${(movie.release_date || movie.Year) ? (new Date(movie.release_date).getFullYear() || movie.Year) : 'N/A'}]</h2>
                                    <p class="unique-movie-rating">Rating ⭐️: ${movie.vote_average || movie.imdbRating || 'N/A'} / 10</p>
                                    <p class="unique-movie-meta">Genre: ${genres}</p>
                                    <p>Story Line: ${movie.overview || movie.Plot || 'N/A'}</p>
                                    <p>Directors: ${(movie.credits && movie.credits.crew) ? movie.credits.crew.filter(member => member.job === 'Director').map(director => director.name).join(', ') : movie.Director || 'N/A'}</p>
                                    <p>Stars: ${(movie.credits && movie.credits.cast) ? movie.credits.cast.slice(0, 5).map(actor => actor.name).join(', ') : movie.Actors || 'N/A'}</p>
                                    <p>Box Office: ${movie.BoxOffice || 'N/A'}</p>
                                    <a href="${source === 'TMDb' ? `https://www.themoviedb.org/movie/${movie.id}` : movie.Website}" target="_blank">Read More ...</a>
                                </div>
                            `;
                    
                            // Append front and back to the card container
                            cardElement.appendChild(frontElement);
                            cardElement.appendChild(backElement);
                            movieElement.appendChild(cardElement);
                    
                            // Add flip effect on click
                            movieElement.addEventListener('click', () => {
                                movieElement.classList.toggle('flip');
                            });
                    
                            container.appendChild(movieElement);
                        }
                    
                        // Combined search function for both TMDb and OMDb
                        async function searchMovies(query) {
                            // Clear previous results
                            tmdbMovieListContainer.innerHTML = '';
                            omdbMovieListContainer.innerHTML = '';
                    
                            const tmdbResults = await fetchUniqueTMDbMovies(query);
                            const omdbResults = await fetchUniqueOMDbMovies(query);
                    
                            // Display TMDb results in its container
                            tmdbResults.forEach(movie => displayUniqueMovieDetails(movie, 'TMDb', tmdbMovieListContainer));
                    
                            // Display OMDb results in its container
                            omdbResults.forEach(movie => displayUniqueMovieDetails(movie, 'OMDb', omdbMovieListContainer));
                    
                            // Show the clear button if there are results
                            if (tmdbResults.length > 0 || omdbResults.length > 0) {
                                clearBtn.style.display = 'block';
                            } else {
                                clearBtn.style.display = 'none';
                            }
                        }
                    
                        // Event listener for the search button
                        uniqueMovieSearchBtn.addEventListener('click', () => {
                            const query = uniqueMovieSearchBar.value.trim();
                            if (query) {
                                searchMovies(query);
                            }
                        });
                    
                        // Event listener for pressing Enter key in the search bar
                        uniqueMovieSearchBar.addEventListener('keypress', (e) => {
                            if (e.key === 'Enter') {
                                const query = uniqueMovieSearchBar.value.trim();
                                if (query) {
                                    searchMovies(query);
                                }
                            }
                        });
                    
                        // Event listener for the clear button
                        clearBtn.addEventListener('click', () => {
                            // Clear results and hide clear button
                            tmdbMovieListContainer.innerHTML = '';
                            omdbMovieListContainer.innerHTML = '';
                            uniqueMovieSearchBar.value = '';
                            clearBtn.style.display = 'none';
                        });
                    });
                    const omdbApiKey = 'ffe8b9b0'; // Replace with your OMDb API key
                    const tmdbMovieListContainer = document.getElementById('tmdb-movie-list');
                    const uniqueMovieSearchBar = document.getElementById('unique-movie-search-bar');
                    const uniqueMovieSearchBtn = document.getElementById('unique-movie-search-btn');
                    const clearBtn = document.getElementById('clear-btn');
                
                    // Fetch TMDb results for various content types
                    async function fetchUniqueTMDbMovies(query) {
                        const url = `https://api.themoviedb.org/3/search/multi?api_key=${tmdbApiKey}&query=${encodeURIComponent(query)}`;
                        try {
                            const response = await fetch(url);
                            const data = await response.json();
                            displayResults(data.results);
                        } catch (error) {
                            console.error('Error fetching TMDb data:', error);
                        }
                    }
                
                    function displayResults(results) {
                        tmdbMovieListContainer.innerHTML = '';
                        if (results.length === 0) {
                            tmdbMovieListContainer.innerHTML = '<p>No results found.</p>';
                            return;
                        }
                
                        results.forEach(result => {
                            const movieElement = document.createElement('div');
                            movieElement.classList.add('movie');
                
                            const title = result.title || result.name || 'Title not found';
                            const episodes = result.number_of_episodes || 'Episodes not found';
                            const seasons = result.number_of_seasons || 'Seasons not found';
                            const cast = result.cast ? result.cast.map(member => member.name).join(', ') : 'Cast not found';
                            const crew = result.crew ? result.crew.map(member => member.name).join(', ') : 'Crew not found';
                            const country = result.origin_country ? result.origin_country.join(', ') : 'Country not found';
                            const language = result.original_language || 'Language not found';
                            const status = result.status || 'Status not found';
                            const network = result.networks ? result.networks.map(network => network.name).join(', ') : 'Network not found';
                            const streamingServices = result.streaming_services || 'Streaming services not found';
                            const tagline = result.tagline || 'Tagline not found';
                            const genre = result.genres ? result.genres.map(genre => genre.name).join(', ') : 'Genre not found';
                            const runtime = result.runtime || 'Runtime not found';
                
                            movieElement.innerHTML = `
                                <h3>${title}</h3>
                                <p><strong>Episodes:</strong> ${episodes}</p>
                                <p><strong>Seasons:</strong> ${seasons}</p>
                                <p><strong>Cast:</strong> ${cast}</p>
                                <p><strong>Crew:</strong> ${crew}</p>
                                <p><strong>Country:</strong> ${country}</p>
                                <p><strong>Language:</strong> ${language}</p>
                                <p><strong>Status:</strong> ${status}</p>
                                <p><strong>Network:</strong> ${network}</p>
                                <p><strong>Streaming Services:</strong> ${streamingServices}</p>
                                <p><strong>Tagline:</strong> ${tagline}</p>
                                <p><strong>Genre:</strong> ${genre}</p>
                                <p><strong>Runtime:</strong> ${runtime} minutes</p>
                            `;
                
                            tmdbMovieListContainer.appendChild(movieElement);
                        });
                    }
                
                    uniqueMovieSearchBtn.addEventListener('click', () => {
                        const query = uniqueMovieSearchBar.value;
                        if (query) {
                            fetchUniqueTMDbMovies(query);
                        }
                    });
                
                    clearBtn.addEventListener('click', () => {
                        tmdbMovieListContainer.innerHTML = '';
                        uniqueMovieSearchBar.value = '';
                    });

                const searchBar = document.getElementById('unique-movie-search-bar');
                searchBar.style.display = 'flex';
                document.getElementById('searchbtn').style.display = 'none';
        
document.addEventListener('DOMContentLoaded', function () {
    const tmdbApiKey = 'd6e256dc1cc661c0bf793767a74948df'; // Replace with your TMDb API key
    const omdbApiKey = 'ffe8b9b0'; // Replace with your OMDb API key
    const tmdbMovieListContainer = document.getElementById('tmdb-movie-list');
    const omdbMovieListContainer = document.getElementById('omdb-movie-list');
    const uniqueMovieSearchBar = document.getElementById('unique-movie-search-bar');
    const uniqueMovieSearchBtn = document.getElementById('unique-movie-search-btn');
    const clearBtn = document.getElementById('clear-btn');

    // Fetch TMDb results for various content types
    async function fetchUniqueTMDbMovies(query) {
        const url = `https://api.themoviedb.org/3/search/multi?api_key=${tmdbApiKey}&query=${encodeURIComponent(query)}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Fetch error:', error);
            return [];
        }
    }

    // Fetch OMDb results for movies, series, etc.
    async function fetchUniqueOMDbMovies(query) {
        const url = `https://www.omdbapi.com/?apikey=${omdbApiKey}&s=${encodeURIComponent(query)}&type=series`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.Search || [];
        } catch (error) {
            console.error('Fetch error:', error);
            return [];
       }
    }

    // Display movie details with flip effect
    function displayUniqueMovieDetails(movie, source, container) {
        const genres = movie.genres ? movie.genres.map(genre => `#${genre.name}`).join(' ') : 'N/A';
        const movieElement = document.createElement('div');
        movieElement.className = 'unique-movie-item';

        const cardElement = document.createElement('div');
        cardElement.className = 'unique-movie-card';

        // Front side with movie image
        const frontElement = document.createElement('div');
        frontElement.className = 'unique-movie-front';
        frontElement.innerHTML = `
            <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : movie.Poster}" alt="${movie.title || movie.Title}">
        `;

        // Back side with movie details
        const backElement = document.createElement('div');
        backElement.className = 'unique-movie-back';
        backElement.innerHTML = `
            <div class="unique-movie-info">
                <h2>${movie.title || movie.Title} [${(movie.release_date || movie.Year) ? (new Date(movie.release_date).getFullYear() || movie.Year) : 'N/A'}]</h2>
                <p class="unique-movie-rating">Rating ⭐️: ${movie.vote_average || movie.imdbRating || 'N/A'} / 10</p>
                <p class="unique-movie-meta">Genre: ${genres}</p>
                <p>Story Line: ${movie.overview || movie.Plot || 'N/A'}</p>
                <p>Directors: ${(movie.credits && movie.credits.crew) ? movie.credits.crew.filter(member => member.job === 'Director').map(director => director.name).join(', ') : movie.Director || 'N/A'}</p>
                <p>Stars: ${(movie.credits && movie.credits.cast) ? movie.credits.cast.slice(0, 5).map(actor => actor.name).join(', ') : movie.Actors || 'N/A'}</p>
                <p>Box Office: ${movie.BoxOffice || 'N/A'}</p>
                <a href="${source === 'TMDb' ? `https://www.themoviedb.org/movie/${movie.id}` : movie.Website}" target="_blank">Read More ...</a>
            </div>
        `;

        // Append front and back to the card container
        cardElement.appendChild(frontElement);
        cardElement.appendChild(backElement);
        movieElement.appendChild(cardElement);

        // Add flip effect on click
        movieElement.addEventListener('click', () => {
            movieElement.classList.toggle('flip');
        });

        container.appendChild(movieElement);
    }

    // Combined search function for both TMDb and OMDb
    async function searchMovies(query) {
        // Clear previous results
        tmdbMovieListContainer.innerHTML = '';
        omdbMovieListContainer.innerHTML = '';

        const tmdbResults = await fetchUniqueTMDbMovies(query);
        const omdbResults = await fetchUniqueOMDbMovies(query);

        // Display TMDb results in its container
        tmdbResults.forEach(movie => displayUniqueMovieDetails(movie, 'TMDb', tmdbMovieListContainer));

        // Display OMDb results in its container
        omdbResults.forEach(movie => displayUniqueMovieDetails(movie, 'OMDb', omdbMovieListContainer));

        // Show the clear button if there are results
        if (tmdbResults.length > 0 || omdbResults.length > 0) {
            clearBtn.style.display = 'block';
        } else {
            clearBtn.style.display = 'none';
        }
    }

    // Event listener for the search button
    uniqueMovieSearchBtn.addEventListener('click', () => {
        const query = uniqueMovieSearchBar.value.trim();
        if (query) {
            searchMovies(query);
        }
    });

    // Event listener for pressing Enter key in the search bar
    uniqueMovieSearchBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = uniqueMovieSearchBar.value.trim();
            if (query) {
                searchMovies(query);
            }
        }
    });

    // Event listener for the clear button
    clearBtn.addEventListener('click', () => {
        // Clear results and hide clear button
        tmdbMovieListContainer.innerHTML = '';
        omdbMovieListContainer.innerHTML = '';
        uniqueMovieSearchBar.value = '';
        clearBtn.style.display = 'none';
    });
});