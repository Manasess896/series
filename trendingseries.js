
const trendingseriesbtns= document.getElementById('movie-grid');
const trendingseriesleftbutton = document.getElementById('trendingseries-left-button');
const trendingseriesrightbutton = document.getElementById('trendingseries-right-button');

// Scroll left
trendingseriesleftbutton.addEventListener('click', () => {
trendingseriesbtns.scrollBy({ left: -300, behavior: 'smooth' });
});

// Scroll right
trendingseriesrightbutton.addEventListener('click', () => {
  trendingseriesbtns.scrollBy({ left: 300, behavior: 'smooth' });
});
window.addEventListener('DOMContentLoaded', function () {
    const tmdbApiKey ='d6e256dc1cc661c0bf793767a74948df';  // Replace with your TMDb API key
    const movieGrid = document.getElementById('movie-grid');
    const regenerateBtn = document.getElementById('movie-regenerate-btn');
    const slideLeftBtn = document.getElementById('slide-left-btn');
    const slideRightBtn = document.getElementById('slide-right-btn');

    let currentSeriesPage = 1; // Initialize the page counter
    let isLoading = false; // Flag to prevent multiple fetches
    let totalPages = null; // Keep track of total available pages

    // Fetch trending series from TMDB
    async function fetchTrendingSeries(page) {
        const url = `https://api.themoviedb.org/3/trending/tv/week?api_key=${tmdbApiKey}&language=en-US&page=${page}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            totalPages = data.total_pages; // Store the total pages
            return data.results;
        } catch (error) {
            console.error('Fetch error:', error);
            return [];
        }
    }

    // Fetch detailed information about a series
    async function fetchSeriesDetails(seriesId) {
        const url = `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${tmdbApiKey}&language=en-US`;
        try {
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            return null;
        }
    }

    // Display series details on the card
    function displaySeries(series, details) {
        const seriesElement = document.createElement('div');
        seriesElement.className = 'card';

        seriesElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <img src="https://image.tmdb.org/t/p/w300${series.poster_path}" alt="${series.name}">
                </div>
                <div class="card-back">
                    <h3>${series.name} (${series.first_air_date.split('-')[0]})</h3>
                    <p>Average Rating: ${series.vote_average}/10</p>
                    <p>Seasons: ${details.number_of_seasons}</p>
                    <p>Episodes: ${details.number_of_episodes}</p>
                    <p>Language: ${details.original_language.toUpperCase()}</p>
                    <p>Story Line: ${series.overview || 'No overview available.'}</p>
                    <a href="https://www.themoviedb.org/tv/${series.id}" target="_blank">Read More</a>
                </div>
            </div>
        `;

        movieGrid.appendChild(seriesElement);

        // Add flip effect on click
        seriesElement.addEventListener('click', () => {
            seriesElement.classList.toggle('flip');
        });
    }

    // Display series by fetching from TMDB
    async function displaySeriesList() {
        if (isLoading || (totalPages && currentSeriesPage > totalPages)) return; // Prevent multiple fetches or fetching beyond total pages
        isLoading = true;

        const seriesList = await fetchTrendingSeries(currentSeriesPage);

        if (seriesList.length === 0) {
            console.log('No more series found.');
            isLoading = false;
            return;
        }

        for (const series of seriesList) {
            const seriesDetails = await fetchSeriesDetails(series.id);
            if (seriesDetails) {
                displaySeries(series, seriesDetails);
            } else {
                console.log(`Error fetching details for series with ID ${series.id}`);
            }
        }

        currentSeriesPage++; // Increment the page counter for the next fetch
        isLoading = false; // Reset the loading flag
    }

    // Infinite scrolling: Load more series when the user scrolls near the bottom
    window.addEventListener('scroll', () => {
        const scrollPosition = window.innerHeight + window.scrollY;
        const threshold = document.body.offsetHeight - 500; // 500px before reaching bottom

        if (scrollPosition >= threshold && !isLoading) {
            displaySeriesList(); // Fetch next page
        }
    });

    // Event listener for regenerate button
    regenerateBtn.addEventListener('click', () => {
        currentSeriesPage = 1; // Reset to the first page
        movieGrid.innerHTML = ''; // Clear the container
        displaySeriesList();
    });

    // Event listeners for sliding buttons
    slideLeftBtn.addEventListener('click', () => {
        movieGrid.scrollBy({
            left: -300, // Adjust this value based on the width of movie items
            behavior: 'smooth'
        });
    });

    slideRightBtn.addEventListener('click', () => {
        movieGrid.scrollBy({
            left: 300, // Adjust this value based on the width of movie items
            behavior: 'smooth'
        });
    });

    // Initial fetch of trending series
    displaySeriesList();
});
