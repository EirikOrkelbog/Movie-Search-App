import { clientId } from "../env.js";

const movieSearchBox = document.querySelector('#movie_search-box');
const searchList = document.querySelector('#search_list');
const resultGrid = document.querySelector('#result_grid');

movieSearchBox.addEventListener('keyup', handleMovieSearch);

function handleMovieSearch(event) {
	findMovies();
}

// load movies from API
export default async function loadMovies(searchTerm) {
	const URL = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=${clientId}`;
	const result = await fetch(`${URL}`);
	const data = await result.json();
	console.log(data.Search);
	if (data.Response == "True") displayMovieList(data.Search);
}

function findMovies() {
	let searchTerm = (movieSearchBox.value).trim();
	if (searchTerm.length > 0) {
		searchList.classList.remove('hide_search-list');
		loadMovies(searchTerm);
	} else {
		searchList.classList.add('hide_search-list');
	}
}

function displayMovieList(movies) {
	searchList.innerHTML = "";
	for (let index = 0; index < movies.length; index++) {
		let movieListItem = document.createElement('div');
		movieListItem.dataset.id = movies[index].imdbID;
		movieListItem.classList.add('search_list-item');
		let moviePoster;
		if (movies[index].Poster !== 'N/A') {
			moviePoster = movies[index].Poster;
		} else {
			moviePoster = '../assets/image_not_found.png';
		}
		movieListItem.innerHTML = `
			<div class="search_item-thumbnail">
				<img src="${moviePoster}">
			</div>
			<div class="search_item-info">
				<h3>${movies[index].Title}</h3>
				<p>${movies[index].Year}</p>
			</div>
			`;
		searchList.appendChild(movieListItem);
	}
	loadMovieDetails();
};

function loadMovieDetails() {
	const searchListMovies = searchList.querySelectorAll('.search_list-item');
	searchListMovies.forEach(movie => {
		movie.addEventListener('click', async () => {
			searchList.classList.add('hide_search-list');
			movieSearchBox.value = "";
			const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=${clientId}`);
			const movieDetails = await result.json();
			displayMovieDetails(movieDetails);
		})
	});
}

function displayMovieDetails(details) {
	resultGrid.innerHTML = `
		<div class="movie_poster">
			<img src="${(details.Poster !== 'N/A') ? details.Poster : 'image_not_found.png'}" class="movie_poster-image">
		</div>

		<div class="movie_info">
			<div class="movie_info-container">
				<h3 class="movie_title">${details.Title}</h3>

				<ul class="movie_info-mix">
					<li class="year">${details.Year}</li>
					<li class="rated">${details.Rated}</li>
					<li class="released">${details.Released}</li>
				</ul>
				<p class="genre"><b>Genre:</b> ${details.Genre}</p>
				<p class="writer"><b>Writers:</b> ${details.Writer}</p>
				<p class="actors"><b>Actors:</b> ${details.Actors}</p>
				<p class="plot"><b>Plot:</b> ${details.Plot}</p>
				<p class="language"><b>Language:</b> ${details.Language}</p>
				<p class="awards"><b>Awards:</b> ${details.Awards}</p>
			</div>
		</div>
		`;
}

window.addEventListener('click', (event) => {
	if (event.target.className !== 'form_control') {
		searchList.classList.add('hide_search-list');
	}
});