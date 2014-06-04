'use strict';

/* Filters */

angular.module('myApp.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }])
	.filter('plural', function(){
		return function(i) {
			return i == 1 ? "" : "s"
		}
	});
