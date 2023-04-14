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
	// let shows = termResults.data;
	let queryResult = [];

	// for (let item in shows) {
	// 	result.push({
	// 		id: shows[item].show.id,
	// 		name: shows[item].show.name,
	// 		summary: shows[item].show.summary,
	// 		image: shows[item].show.image.medium
	// 			? shows[item].show.image.medium
	// 			: missingImageURL,
	// 	});
	// }
	// return result;

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
			`<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="http://static.tvmaze.com/uploads/images/medium_portrait/160/401704.jpg" 
              alt="Bletchly Circle San Francisco" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
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
	const term = $('#searchForm-term').val();
	const shows = await getShowsByTerm(term);

	$episodesArea.hide();
	populateShows(shows);
}

$searchForm.on('submit', async function (evt) {
	evt.preventDefault();
	await searchForShowAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
