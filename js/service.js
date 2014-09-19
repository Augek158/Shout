(function () {
"use strict";

/**
 * SearchService - Service to handle requests to external API:s	
 * @param {Service}  $http - used to handle http requests
 * @param {Service}  $q - used for deferring
 */
function SearchService ($http, $q) {

	/* Public methods */

	/**
	 * querySpotify - Function to query the Spotify API
	 * @param  {String} query - The search query in the format artist - track
	 * @return {Object} The information about the track if successfull,
	 *                  else an empty object.
	 */
	this.querySpotify  = function (query) {
		var formattedQuery = formatQuery(query),
			deferred = $q.defer();

		// TODO: should not do http request (use deferred / timeout)
		if(!formattedQuery) deferred.reject({Error: "Invalid query format!"});

		$http({
			url: 'https://api.spotify.com/v1/search',
			method: "GET",
			params: {
				q: formattedQuery,
				type: "artist,track"
			}
		}).success(function (data) {
			deferred.resolve(handleResult(data));
		}).error(function (msg, code) {
			deferred.reject(msg);
		});
		return deferred.promise;
	};

	/* Private methods */

	/**
	 * formatQuery - Formats and tests a query to fit the Spotify API	
	 * @param  {String} query - The query to format
	 * @return {String}
	 */
	function formatQuery (query) {
		if(!query.match(/[a-zA-Z0-9åäö&\s]+\s-\s[a-zA-Z0-9åäö&\s\-()]+/)){
			return null;
		}

		query = query.split("-");
		var artist = query[0].trim()
							 .split(" ")
							 .join("+");

		var	track = query[1].trim()
							.split(" ")
							.join("+");

		return artist + "+-+" + track;
	};

	/**
	 * handleResult - Handles the result of a query	
	 * @param  {Object} result - The result to handle
	 * @return {Object}
	 */
	function handleResult (result) {
		var obj = {},
			track = {};

		if(!result.tracks.items.length){
			return obj;
		}

		// TODO: Should perhaps pick something else than the first track
		track = result.tracks.items[0];

		obj.artist_name = track.artists[0].name;
		obj.track_name = track.name;
		obj.uri = track.uri
		return obj;
	};
}

angular.module("shoutApp").service("SearchService", SearchService);

})();