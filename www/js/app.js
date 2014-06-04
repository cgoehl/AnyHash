'use strict';

$(document).bind("mobileinit", function(){
  $.extend(  $.mobile , {
    defaultPageTransition: "slide"
  });
});
// Declare app level module which depends on filters, and services
angular.module('myApp', [
	//'ngRoute',
	'myApp.filters',
	'myApp.services',
	'myApp.directives',
	'myApp.controllers',
	'LocalStorageModule'
]).run(function() {
	FastClick.attach(document.body);
});