'use strict';

const $showsList = $('#shows-list');
const $episodesArea = $('#episodes-area');
const $searchForm = $('#search-form');

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
	// ADD: Remove placeholder & make request to TVMaze search shows API.
	const termResults = await axios.get(
		`https://api.tvmaze.com/search/shows?q=${term}`
	);
	const missingImageURL = 'https://tinyurl.com/tv-missing';
	let queryResult = [];
	for (let data of termResults.data) {
		queryResult.push({
			id: data.show.id,
			name: data.show.name,
			summary: data.show.summary,
			image: data.show.image.medium ? data.show.image.medium : missingImageURL,
		});
	}
	return queryResult;
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
	$showsList.empty();

	for (let show of shows) {
		const $show = $(
			`<div data-show-id="${show.id}" class="Show col-md-6 col-lg-4 mb-4">
         <div class="media">
           <img 
              src="${show.image}" 
              alt="${show.name}" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-light btn-sm Show-getEpisodes">
               Episodes
             </button>

           </div>
         </div>  
       </div>
      `
		);

		$showsList.append($show);
	}
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
	const term = $('#search-query').val();
	const shows = await getShowsByTerm(term);

	$episodesArea.hide();
	populateShows(shows);
	episodeLoader();
}

$searchForm.on('submit', async function (evt) {
	evt.preventDefault();
	await searchForShowAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
	const episodesData = await axios.get(
		`http://api.tvmaze.com/shows/${id}/episodes`
	);
	let showEpisodes = [];
	for (let episode of episodesData.data) {
		showEpisodes.push({
			id: episode.id,
			season: episode.season,
			name: episode.name,
			number: episode.number,
		});
	}
	return showEpisodes;
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
	$('#episodes-list').empty();
	for (let episode of episodes) {
		$('#episodes-list').append(
			`<li><b>${episode.name} </b>(season ${episode.season}, number ${episode.number})</li>`
		);
	}
	$('#episodes-area').show();
}

async function episodeLoader() {
	$('.Show-getEpisodes').on('click', async function (evt) {
		const selectedId = $(this).parents('.Show').attr('data-show-id');
		const allEpisodes = await getEpisodesOfShow(selectedId);
		populateEpisodes(allEpisodes);
	});
}
