require('dotenv').config();
window.addEventListener('DOMContentLoaded', function () {
        const onAirGrid = document.getElementById('on-air-grid');
    const tmdbApiKey =process.env.TMDB_KEY;  // Replace with your TMDb API key
    const recommendationGrid = document.getElementById('recommendation-grid');
    const recommendationSearchBtn = document.getElementById('recommendation-search-btn');
    const recommendationSearchInput = document.getElementById('recommendation-search-input');

    let isRecommendationLoading = false; // Flag to prevent multiple fetches

    // Fetch a movie or series ID based on user input
    async function fetchMediaId(query) {
      const url = `https://api.themoviedb.org/3/search/multi?api_key=${tmdbApiKey}&query=${encodeURIComponent(query)}&language=en-US`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results && data.results.length > 0 ? data.results[0].id : null; // Get the first result's ID
      } catch (error) {
        console.error('Fetch error:', error);
        return null;
      }
    }

    // Fetch similar movies based on a media ID
    async function fetchSimilarMovies(mediaId) {
      const url = `https://api.themoviedb.org/3/movie/${mediaId}/similar?api_key=${tmdbApiKey}&language=en-US`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results || [];
      } catch (error) {
        console.error('Fetch error:', error);
        return [];
      }
    }

    // Fetch detailed information about a movie
    async function fetchMovieDetails(movieId) {
      const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${tmdbApiKey}&language=en-US`;
      try {
        const response = await fetch(url);
        return await response.json();
      } catch (error) {
        console.error('Fetch error:', error);
        return null;
      }
    }

    // Fetch additional details like credits and videos
    async function fetchMovieCreditsAndVideos(movieId) {
      const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${tmdbApiKey}&language=en-US`;
      const videosUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${tmdbApiKey}&language=en-US`;

      try {
        const [creditsResponse, videosResponse] = await Promise.all([
          fetch(creditsUrl),
          fetch(videosUrl)
        ]);

        const credits = await creditsResponse.json();
        const videos = await videosResponse.json();
        return { credits, videos };
      } catch (error) {
        console.error('Error fetching credits or videos:', error);
        return { credits: {}, videos: {} }; // Return empty objects in case of error
      }
    }

    // Display movie details on the recommendation card
    function displayRecommendationMovie(movie, details, credits) {
      if (!details) {
        console.log(`No details available for ${movie.title}`);
        return;
      }

      const recommendationElement = document.createElement('div');
      recommendationElement.className = 'recommendation-card';

      const castNames = credits.cast ? credits.cast.slice(0, 5).map(cast => cast.name).join(', ') : 'N/A';
      const crewNames = credits.crew ? credits.crew.filter(crew => crew.job === 'Director').map(crew => crew.name).join(', ') : 'N/A';

      const trailerKey = details.videos?.results.find(video => video.type === 'Trailer')?.key;
      const trailerLink = trailerKey ? `https://www.youtube.com/watch?v=${trailerKey}` : 'No trailer available';

      recommendationElement.innerHTML = `
        <div class="recommendation-card-inner">
          <div class="recommendation-card-front">
              <p class="title">${movie.title} (${new Date(details.release_date).getFullYear()})</p>
            <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}">
          </div>
          <div class="recommendation-card-back">
            <h3>${movie.title} (${new Date(details.release_date).getFullYear()})</h3>
            <p>Average Rating: ${movie.vote_average}/10</p>
            <p>Runtime: ${details.runtime} minutes</p>
            <p>Release Date: ${details.release_date}</p>
            <p>Cast: ${castNames}</p>
            <p>Director: ${crewNames}</p>
            <p>Overview: ${details.overview || 'No overview available.'}</p>
            <p>Language: ${details.original_language.toUpperCase()}</p>
            <p>Country: ${details.production_countries.map(c => c.name).join(', ')}</p>
            <p>Status: ${details.status}</p>
            <p>Budget: $${details.budget.toLocaleString() || 'N/A'}</p>
            <p>Revenue: $${details.revenue.toLocaleString() || 'N/A'}</p>
            <p>Trailer: <a href="${trailerLink}" target="_blank">${trailerLink}</a></p>
            <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank">Read More</a>
          </div>
        </div>
      `;

      recommendationGrid.appendChild(recommendationElement);

      // Add flip effect on click
      recommendationElement.addEventListener('click', () => {
        recommendationElement.classList.toggle('flip');
      });
    }

    // Handle search button click
    recommendationSearchBtn.addEventListener('click', async () => {
      const query = recommendationSearchInput.value.trim();
      if (!query) return;

      if (isRecommendationLoading) return; // Prevent multiple fetches
      isRecommendationLoading = true;
      recommendationGrid.innerHTML = ''; // Clear previous results

      const mediaId = await fetchMediaId(query);
      if (mediaId) {
        const similarMovies = await fetchSimilarMovies(mediaId);

        for (const movie of similarMovies) {
          const details = await fetchMovieDetails(movie.id);
          const { credits, videos } = await fetchMovieCreditsAndVideos(movie.id);
          if (details) {
            displayRecommendationMovie(movie, details, credits);
          } else {
            console.log(`Error fetching details for movie with ID ${movie.id}`);
          }
        }
      } else {
        console.log('No media found for the provided input.');
      }

      isRecommendationLoading = false; // Reset the loading flag
    });});