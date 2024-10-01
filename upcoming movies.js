
upcomingMovies= document.getElementById('upcoming-grid');
    const upcomingleftButton = document.getElementById('upcoming-left-button');
    const upcomingrightButton = document.getElementById('upcoming-right-button');

    // Scroll left
    upcomingleftButton.addEventListener('click', () => {
    upcomingMovies.scrollBy({ left: -300, behavior: 'smooth' });
    });

    // Scroll right
    upcomingrightButton.addEventListener('click', () => {
      upcomingMovies.scrollBy({ left: 300, behavior: 'smooth' });
    });
    window.addEventListener('DOMContentLoaded', function() {
      const tmdbApiKey =process.env.TMDB_KEY;  // Replace with your TMDb API key
      const upcomingGrid = document.getElementById('upcoming-grid');
      const upcomingLoadMoreBtn = document.getElementById('upcoming-load-more-btn');

      let currentUpcomingPage = 1;
      let isLoadingUpcoming = false;

      // Fetch upcoming movies
      async function fetchUpcomingMovies(page) {
        const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${tmdbApiKey}&language=en-US&page=${page}`;
        try {
          const response = await fetch(url);
          const data = await response.json();

          if (!data || !data.results) {
            console.error('Error: No results found in the response.');
            return [];
          }
          return data.results;
        } catch (error) {
          console.error('Fetch error:', error);
          return [];
        }
      }

      // Fetch detailed movie information
      async function fetchUpcomingMovieDetails(movieId) {
        const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${tmdbApiKey}&language=en-US&append_to_response=credits,videos,recommendations,similar`;
        try {
          const response = await fetch(url);
          return await response.json();
        } catch (error) {
          console.error('Fetch error:', error);
          return null;
        }
      }

      // Display movie details in a card
      function displayUpcomingMovie(movie, details) {
        const movieElement = document.createElement('div');
        movieElement.className = 'upcoming-card';

        const genres = details.genres?.map(g => g.name).join(', ') || 'N/A';
        const cast = details.credits?.cast?.slice(0, 5)?.map(c => c.name).join(', ') || 'N/A';
        const trailer = details.videos?.results?.find(v => v.type === 'Trailer');
        const overview = movie.overview || 'No overview available';

        const runtime = details.runtime ? `${details.runtime} minutes` : 'N/A';
        const language = details.original_language ? details.original_language.toUpperCase() : 'N/A';
        const tagline = details.tagline || 'N/A';
        const productionCompanies = details.production_companies?.map(c => c.name).join(', ') || 'N/A';
        const productionCountries = details.production_countries?.map(c => c.name).join(', ') || 'N/A';
        const budget = details.budget ? `$${details.budget.toLocaleString()}` : 'N/A';
        const revenue = details.revenue ? `$${details.revenue.toLocaleString()}` : 'N/A';
        const homepage = details.homepage ? `<a href="${details.homepage}" target="_blank">Official Website</a>` : 'N/A';
        const keywords = details.keywords?.results?.map(k => k.name).join(', ') || 'N/A';

        movieElement.innerHTML = `
                    <div class="upcoming-card-inner">
                        <div class="upcoming-card-front">
                                        <p class="title">Title🎬: ${movie.title} (${movie.release_date.split('-')[0]})</p>
                            <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}">
                        </div>
                        <div class="upcoming-card-back">
                            <h3 style="color:red">Title🎬: ${movie.title} (${movie.release_date.split('-')[0]})</h3>
                            <p style="color:yellow"><strong>Vote Count:</strong> ${details.vote_count || 'N/A'}</p>
                            <p style="color:red"><strong>Status:</strong> ${details.status || 'N/A'}</p>
                            <p style="color:yellow"><strong>Ratings⭐:</strong> ${details.vote_average || 'N/A'}</p>
                            <p style="color:lightblue;"><strong>Genres:</strong> ${genres}</p>
                            <p><strong>Cast:</strong> ${cast}</p>
                            <p><strong>Runtime:</strong> ${runtime}</p>
                            <p><strong>Language:</strong> ${language}</p>
                            <p><strong>Tagline:</strong> "${tagline}"</p>
                            <p><strong>Overview:</strong> ${overview}</p>
                            <p><strong>Production Companies:</strong> ${productionCompanies}</p>
                            <p><strong>Production Countries:</strong> ${productionCountries}</p>
                            <p><strong>Budget:</strong> ${budget}</p>
                            <p><strong>Revenue:</strong> ${revenue}</p>
                            <p><strong>Popularity:</strong> ${details.popularity || 'N/A'}</p>
                            <p><strong>Keywords:</strong> ${keywords}</p>
                            ${trailer ? `<a href="https://www.youtube.com/watch?v=${trailer.key}" target="_blank">Watch Trailer</a>` : ''}
                            <br>${homepage}
                        </div>
                    </div>
                `;

        upcomingGrid.appendChild(movieElement);

        // Add flip effect
        movieElement.addEventListener('click', () => {
          movieElement.classList.toggle('flip');
        });
      }

      // Display upcoming movies
      async function displayUpcomingMovies() {
        if (isLoadingUpcoming) return; // Prevent multiple fetches
        isLoadingUpcoming = true;

        const upcomingList = await fetchUpcomingMovies(currentUpcomingPage);

        if (upcomingList.length === 0) {
          console.log('No more movies found.');
          isLoadingUpcoming = false;
          return;
        }

        for (const movie of upcomingList) {
          const movieDetails = await fetchUpcomingMovieDetails(movie.id);
          if (movieDetails) {
            displayUpcomingMovie(movie, movieDetails);
          } else {
            console.log(`Error fetching details for movie with ID ${movie.id}`);
          }
        }

        currentUpcomingPage++; // Increment the page counter for the next fetch
        isLoadingUpcoming = false;
      }

      // Infinite scrolling
      window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
          displayUpcomingMovies();
        }
      });

      // Initial fetch
      displayUpcomingMovies();

      // Load more button
      upcomingLoadMoreBtn.addEventListener('click', () => {
        displayUpcomingMovies();
      });
    });