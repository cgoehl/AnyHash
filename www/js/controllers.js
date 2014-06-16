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
		
		function generate(password, url, settings) {
			console.log("generate", arguments)
			var salt = getToken(url, settings.ignoreTld, settings.ignoreVhost);
			salt += settings.iteration && settings.iteration > 0 
				? settings.iteration
				: "";
			var key = scrypt(password, salt); 
			return key.substring(0, settings.length)
		}
		
		function getSettings(url, sites) {
			return sites[getToken(url, false, false)]
				|| sites[getToken(url, true, false)]
				|| sites[getToken(url, false, true)]
				|| sites[getToken(url, true, true)]
				|| null;
		}
		
		function getToken(url, ignoreTld, ignoreVhost) {
			var host = new Uri(url).host();
			var parts = host.split(".");
			if (parts.length == 1)
				return parts[0];
			if (ignoreTld && ignoreVhost)
				return parts[parts.length-2];
			if (ignoreTld)
				return parts.slice(0, parts.length - 1).join(".");
			if (ignoreVhost)
				return parts.slice(parts.length - 2, parts.length).join(".");
			return host;
		}		
		
		function scrypt(password, salt) {
			console.log("scrypt", password, salt);
			var s = scrypt_module_factory();
			var u8 = s.crypto_scrypt
				(s.encode_utf8(password)
				, s.encode_utf8(salt)
				, 16384, 8, 1, 64);
			var base64 = btoa(String.fromCharCode.apply(null, u8));
			return base64;
		}
		
		$scope.loadSite = function(site) {
			$scope.site = site;
			/*var s = $scope.sites[site];
			$scope.length = s.length;
			$scope.ignoreTld = s.ignoreTld;
			$scope.ignoreVhost = s.ignoreVhost;
			$scope.iteration = s.iteration;*/
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