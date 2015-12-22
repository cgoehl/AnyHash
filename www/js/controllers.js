'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('AnyHashCtrl', function($scope, $timeout, $http, localStorageService) {
		$scope.appName = "AnyHash";
		$scope.version = 0.1;
		$scope.masterPassword = "";
		$scope.site = "";
		$scope.result = "";
		$scope.defaultSettings = { ignoreTld: true, ignoreVhost: true, length: 20, iteration: 0 };
		$scope.settings = $scope.defaultSettings;
		$scope.sites = {};
		$scope.siteList = [];

		$scope.scrypt = scrypt_module_factory();

		$scope.generateClick = function()
		{
			var foundSettings = getSettings($scope.site, $scope.sites);
			var effectiveSettings = foundSettings ? foundSettings : $scope.defaultSettings;
			$scope.result = generate($scope.masterPassword, $scope.site, effectiveSettings);
			var token = getToken($scope.site, effectiveSettings.ignoreTld, effectiveSettings.ignoreVhost)
			if (token && token.length) {
				$scope.sites[token] = effectiveSettings;
			}
			$scope.save();
		}



		$scope.loadSite = function(site) {
			$scope.site = site;
			$scope.settings = $scope.sites[site];
			if ($scope.masterPassword && $scope.masterPassword.length) {
				$scope.generate();
			}
		}

		$scope.deleteSite = function(site) {
			console.log(site);
			delete $scope.sites[site];
			$scope.save();
		}

		$scope.save = function() {
			localStorageService.set("sites", $scope.sites);
			$scope.siteList = Object.keys($scope.sites).sort();
			console.log($scope.siteList);
		}

		$scope.boot = function() {
			var sites = localStorageService.get("sites");
			$scope.sites = sites ? sites : {};
			console.log($scope.sites);
			$scope.save();
		}

		$scope.boot();
  });
