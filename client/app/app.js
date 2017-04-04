'use strict';

/**
 * @ngdoc overview
 * @name paktApp
 * @description
 * # paktApp
 *
 * Main module of the application.
 */
angular
  .module('app', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    "ui.router",
    'ngSanitize',
    'ngTouch',
    'ngMaterial',
    'ngMdIcons',
    'firebase',
    'ngMap'
  ])
  .config(function ( $urlRouterProvider, $locationProvider) {

    //TODO - Enable this when going live
    //$locationProvider.html5Mode(true).hashPrefix('!');

    $urlRouterProvider.otherwise('/');

  });
