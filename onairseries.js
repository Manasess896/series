
window.addEventListener('DOMContentLoaded', function () {
        const tmdbApiKey ='d6e256dc1cc661c0bf793767a74948df';  // Replace with your TMDb API key
        const onAirGrid = document.getElementById('on-air-grid');
        const loadMoreBtn = document.getElementById('on-air-load-more-btn');

        let currentOnAirPage = 1;
        let isLoading = false;

        // Fetch on-air series
        async function fetchOnAirSeries(page) {
            const url = `https://api.themoviedb.org/3/tv/on_the_air?api_key=${tmdbApiKey}&language=en-US&page=${page}`;
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

        // Fetch detailed series information
        async function fetchSeriesDetails(seriesId) {
            const url = `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${tmdbApiKey}&language=en-US&append_to_response=credits,videos,recommendations,similar`;
            try {
                const response = await fetch(url);
                return await response.json();
            } catch (error) {
                console.error('Fetch error:', error);
                return null;
            }
        }

        // Display series details in a card
        function displaySeries(series, details) {
            const seriesElement = document.createElement('div');
            seriesElement.className = 'on-air-card';

            const genres = details.genres?.map(g => g.name).join(', ') || 'N/A';
            const cast = details.credits?.cast?.slice(0, 5)?.map(c => c.name).join(', ') || 'N/A';
            const creators = details.created_by?.map(c => c.name).join(', ') || 'N/A';
            const trailer = details.videos?.results?.find(v => v.type === 'Trailer');
            const network = details.networks?.map(n => n.name).join(', ') || 'N/A';
            const recommendations = details.recommendations?.results?.slice(0, 3)?.map(r => r.name).join(', ') || 'N/A';
            const similar = details.similar?.results?.slice(0, 3)?.map(s => s.name).join(', ') || 'N/A';
            const overview = series.overview || 'No overview available';

            const seasonOverview = details.seasons?.length ? details.seasons.map(season => `${season.name}: ${season.overview}`).join('<br>') : 'N/A';
            const streamingServices = details.networks?.map(n => n.name).join(', ') || 'N/A';
            const certification = details.content_ratings?.results?.find(r => r.iso_3166_1 === 'US')?.rating || 'N/A';
            const productionCompanies = details.production_companies?.map(pc => pc.name).join(', ') || 'N/A';
            const productionCountries = details.production_countries?.map(pc => pc.name).join(', ') || 'N/A';
            const homepage = details.homepage || 'N/A';
            const voteCount = details.vote_count || 'N/A';
            const averageVote = details.vote_average || 'N/A';
            const language = details.original_language || 'N/A';

            seriesElement.innerHTML = `
                <div class="on-air-card-inner">
                    <div class="on-air-card-front">
                    <p class="title">Title🎬:${series.name} (${series.first_air_date.split('-')[0]})</p>
                        <img src="https://image.tmdb.org/t/p/w300${series.poster_path}" alt="${series.name}">
                    </div>
                    <div class="on-air-card-back">
                        <h3 style="color:red;">Title🎬:${series.name} (${series.first_air_date.split('-')[0]})</h3>
                                                <p style="color:yellow";><strong>Rating⭐:</strong> ${averageVote}</p>
           
                      <p style="color:lightgreen";><strong>Status:</strong> ${details.status || 'N/A'}</p>
                        <p style="color:lightblue";><strong>Seasons:</strong> ${details.number_of_seasons || 'N/A'}, <strong>Episodes:</strong> ${details.number_of_episodes || 'N/A'}</p>
                        
                        <p><strong>Networks:</strong> ${network}</p>
                        <p><strong>Episode Runtime:</strong> ${details.episode_run_time[0] || 'N/A'} minutes</p>
                        <p><strong>Airing Dates:</strong> ${details.first_air_date || 'N/A'} - ${details.last_air_date || 'Ongoing'}</p>
                        <p style="color:lightblue";><strong>Genres:</strong> ${genres}</p>
                        <p><strong>Cast:</strong> ${cast}</p>
                        <p><strong>Creators:</strong> ${creators}</p>
                        <p><strong>Popularity:</strong> ${details.popularity || 'N/A'}</p>
                        <p><strong>Vote Count:</strong> ${voteCount}</p>
             <p><strong>Homepage:</strong> <a href="${homepage}" target="_blank">${homepage}</a></p>
                        <p><strong>Certification:</strong> ${certification}</p>
                        <p><strong>Streaming Services:</strong> ${streamingServices}</p>
                            <p><strong>Overview:</strong> ${overview}</p>
                      
                        <p><strong>Production Companies:</strong> ${productionCompanies}</p>
                        <p><strong>Production Countries:</strong> ${productionCountries}</p>
                        ${trailer ? `<a href="https://www.youtube.com/watch?v=${trailer.key}" target="_blank">Watch Trailer</a>` : ''}
                    </div>
                </div>
            `;

            onAirGrid.appendChild(seriesElement);

            // Add flip effect
            seriesElement.addEventListener('click', () => {
                seriesElement.classList.toggle('flip');
            });
        }

        // Display on-air series
        async function displayOnAirSeries() {
            if (isLoading) return; // Prevent multiple fetches
            isLoading = true;

            const onAirList = await fetchOnAirSeries(currentOnAirPage);

            if (onAirList.length === 0) {
                console.log('No more series found.');
                isLoading = false;
                return;
            }

            for (const series of onAirList) {
                const seriesDetails = await fetchSeriesDetails(series.id);
                if (seriesDetails) {
                    displaySeries(series, seriesDetails);
                } else {
                    console.log(`Error fetching details for series with ID ${series.id}`);
                }
            }

            currentOnAirPage++; // Increment the page counter for the next fetch
            isLoading = false;
        }

        // Infinite scrolling
        window.addEventListener('scroll', () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
                displayOnAirSeries();
            }
        });

        // Initial fetch
        displayOnAirSeries();

        // Load more button
        loadMoreBtn.addEventListener('click', () => {
            displayOnAirSeries();
        });
    });
