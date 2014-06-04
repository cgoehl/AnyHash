'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
	.directive( 'goClick', function ( $location ) {
		return function ( scope, element, attrs ) {
			var path;

			attrs.$observe( 'goClick', function (val) {
				path = val;
			});

			element.bind( 'click', function () {
				scope.$apply( function () {
					$location.path( path );
				});
			});
		};
	});
