(function () {
"use strict";
	function SearchCtrl (SearchService) {
		var vm = this;

		vm.handleQuery = function ($event, text) {
			if($event.keyCode === 13){
				var promise = SearchService.querySpotify(text);	

				promise.then(
				  function (answer) {
				  	console.log(answer);
				  },
				  function (error) {
				  	console.log(error);
				  });
			}
		};
	};
	angular.module('shoutApp').controller("SearchCtrl", SearchCtrl);
})();
