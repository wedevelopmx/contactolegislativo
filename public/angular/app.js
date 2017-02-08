angular.module('app', ['ngRoute', 'ngResource'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'angular/templates/main.html',
      controller: 'MainController'
    })
    .when('/district/:id', {
      templateUrl: 'angular/templates/district.html',
      controller: 'DistrictController'
    })
    .when('/chamber', {
      templateUrl: 'angular/templates/chamber.html',
      controller: 'ChamberController'
    })
    .when('/about', {
      templateUrl: 'angular/templates/static/about.html'
    })
    .when('/sources', {
      templateUrl: 'angular/templates/static/sources.html'
    })
    .when('/methodology', {
      templateUrl: 'angular/templates/static/methodology.html'
    });
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
