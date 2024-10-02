
const upcomingMoviesGrid = document.getElementById('series-grid-highrated');
    const leftButton = document.getElementById('highrated-left-btn');
    const rightButton = document.getElementById('highrated-right-btn');

    // Scroll left
    leftButton.addEventListener('click', () => {
      upcomingMoviesGrid.scrollBy({ left: -300, behavior: 'smooth' });
    });

    // Scroll right
    rightButton.addEventListener('click', () => {
      upcomingMoviesGrid.scrollBy({ left: 300, behavior: 'smooth' });
    });
    window.addEventListener('DOMContentLoaded', function() {
      const tmdbApiKeyHighRated = 'd6e256dc1cc661c0bf793767a74948df'; // Replace with your TMDb API key
      const seriesGridHighRated = document.getElementById('series-grid-highrated');

      let currentSeriesPageHighRated = 1;
      let isLoadingSeriesHighRated = false;
      let hasMoreSeriesHighRated = true;

      async function fetchHighRatedSeries(page) {
        const url = `https://api.themoviedb.org/3/tv/top_rated?api_key=${tmdbApiKeyHighRated}&language=en-US&page=${page}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          return data.results;
        } catch (error) {
          console.error('Error fetching high-rated series:', error);
          return [];
        }
      }

      async function fetchSeriesDetailsHighRated(seriesId) {
        const url = `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${tmdbApiKeyHighRated}&language=en-US`;
        try {
          const response = await fetch(url);
          return await response.json();
        } catch (error) {
          console.error('Error fetching series details:', error);
          return null;
        }
      }

      function displaySeriesHighRated(series, details) {
        const seriesElementHighRated = document.createElement('div');
        seriesElementHighRated.className = 'series-card-highrated';

        const posterPath = series.poster_path ? `https://image.tmdb.org/t/p/w300${series.poster_path}` : 'path-to-default-image.jpg';

        seriesElementHighRated.innerHTML = `
                <div class="series-card-inner-highrated">
                    <div class="series-card-front-highrated">
                        <img src="${posterPath}" alt="${series.name}">
                         <p class="title">Title🎬: ${series.name} (${series.first_air_date.split('-')[0]})</p>
                    </div>
                    <div class="series-card-back-highrated">
                        <h3 style="color:red;">Title🎬: ${series.name} (${series.first_air_date.split('-')[0]})</h3>
                        <p style="color:yellow;">Rating⭐: ${series.vote_average}/10</p>
                        <p>Seasons: ${details.number_of_seasons || 'N/A'}</p>
                        <p>Episodes: ${details.number_of_episodes || 'N/A'}</p>
                        <p>Genres: ${details.genres.map(genre => genre.name).join(', ') || 'N/A'}</p>
                        <p>Status: ${details.status || 'N/A'}</p>
                        <p>Networks: ${details.networks.map(network => network.name).join(', ') || 'N/A'}</p>
                        <p>Episode Runtime: ${details.episode_run_time[0] || 'N/A'} min</p>
                        <p>Airing Dates: ${details.first_air_date} - ${details.last_air_date || 'N/A'}</p>
                        <p>Language: ${details.original_language || 'N/A'}</p>
                        <p>Country: ${details.origin_country.join(', ') || 'N/A'}</p>
                        <p>Tagline: ${details.tagline || 'N/A'}</p>
                        <p>Overview: ${series.overview || 'No overview available.'}</p>
                        <p>Creators: ${details.created_by.map(creator => creator.name).join(', ') || 'N/A'}</p>
                 
                        <a href="https://www.themoviedb.org/tv/${series.id}" target="_blank">Read More</a>
                    </div>
                </div>
            `;

        seriesGridHighRated.appendChild(seriesElementHighRated);

        seriesElementHighRated.addEventListener('click', () => {
          seriesElementHighRated.classList.toggle('series-card-flip-highrated');
        });
      }

      async function displaySeriesListHighRated() {
        if (isLoadingSeriesHighRated || !hasMoreSeriesHighRated) return;
        isLoadingSeriesHighRated = true;

        const seriesListHighRated = await fetchHighRatedSeries(currentSeriesPageHighRated);

        if (seriesListHighRated.length === 0) {
          console.log('No more series found.');
          hasMoreSeriesHighRated = false;
          isLoadingSeriesHighRated = false;
          return;
        }

        for (const series of seriesListHighRated) {
          const seriesDetailsHighRated = await fetchSeriesDetailsHighRated(series.id);
          if (seriesDetailsHighRated) {
            displaySeriesHighRated(series, seriesDetailsHighRated);
          } else {
            console.log(`Error fetching details for series with ID ${series.id}`);
          }
        }

        currentSeriesPageHighRated++;
        isLoadingSeriesHighRated = false;
      }

      window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !isLoadingSeriesHighRated) {
          displaySeriesListHighRated();
        }
      });

      displaySeriesListHighRated();
    });
