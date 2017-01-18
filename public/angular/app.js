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
    .when('/deputy/:id', {
      templateUrl: 'angular/templates/deputy.html',
      controller: 'DeputyController'
    });
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
