'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('AnyHashCtrl', function($scope, $timeout, $http, localStorageService) {
		$scope.appName = "AnyHash";
		$scope.version = 0.1;
		$scope.masterPassword = "";
		$scope.site = "";
		$scope.result = "";
		$scope.ignoreTld = true;
		$scope.ignoreVhost = true;
		$scope.length = 20;
		$scope.sites = {};
		$scope.siteList = [];
		
		$scope.scrypt = scrypt_module_factory();
		
		$scope.generate = function()
		{
			var token = $scope.getToken();
			var scryptText = $scope.scrypt($scope.masterPassword, token);
			if (token && token.length) {
				$scope.sites[token] = { length: $scope.length, ignoreTld: $scope.ignoreTld, ignoreVhost: $scope.ignoreVhost };
				$scope.save();
			}
			$scope.result = scryptText.substring(0, $scope.length); 
		}
		
		$scope.getToken = function getToken() {
			function applyIgnores(host, ignore_tld, ignore_vhost) {
				var parts = host.split(".");
				if (parts.length == 1)
					return parts[0];
				if (ignore_tld && ignore_vhost)
					return parts[parts.length-2];
				if (ignore_tld)
					return parts.slice(0, parts.length - 1).join(".");
				if (ignore_vhost)
					return parts.slice(parts.length - 2, parts.length).join(".");
				return host;
			}
			
			var host = new Uri($scope.site).host();
			return applyIgnores(host, $scope.ignoreTld, $scope.ignoreVhost);
		}
		
		$scope.scrypt = function scrypt(password, salt) {
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
			var s = $scope.sites[site];
			$scope.length = s.length;
			$scope.ignoreTld = s.ignoreTld;
			$scope.ignoreVhost = s.ignoreVhost;
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