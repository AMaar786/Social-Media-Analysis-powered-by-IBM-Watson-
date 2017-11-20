'use strict';

/* App Module */

var Services = angular.module('wvajs.services',[]);
var Controllers = angular.module('wvajs.controllers', []);
var modules = [
               'ngCookies',
               'wvajs.directives',
               'wvajs.controllers',
               'wvajs.services',
               'restangular',
               'ngMessages',	
               'ui.bootstrap',
               'luegg.directives'
           ];

var ppApp = angular.module('wvajs', modules);


//! Backend API URL
var Settings = {};			
//Settings.serviceBaseUrl='http://localhost:8080/realtime_sma';
Settings.serviceBaseUrl='https://stream-test.mybluemix.net';
ppApp.config(
    function($httpProvider,RestangularProvider) {
        RestangularProvider.setBaseUrl(Settings.serviceBaseUrl); 
     
    }
);


ppApp.run(function($rootScope, $location, authService, restservice, $cookieStore, $http) {
	$rootScope.serviceBaseUrl = Settings.serviceBaseUrl;
    authService.setServiceBaseUrl(Settings.serviceBaseUrl);
   /* $http.defaults.headers.common['Accept'] = 'application/json;charset=utf-8';
    $http.defaults.headers.common['Accept-Charset'] = 'charset=utf-8'; */
});
