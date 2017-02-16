angular.module('app', ['ngRoute', 'ngResource'])
  .run(['$rootScope', '$location', '$window', function ($rootScope, $location, $window) {
    $rootScope.$on('$routeChangeSuccess', function () {
      //console.log('Route Change: ' + $location.url());
      $window.ga('send', {
        'hitType': 'screenview',
        'appName' : 'contactoLegislativoWeb',
        'screenName' : $location.url(),
        'hitCallback': function() {
          console.log('GA Hitback: ' + $location.url());
        }
      });
    });
  }])
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
  }])
  .config(['$compileProvider', function( $compileProvider ) {
    //Allowing links to whatsapp
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|whatsapp):/);
  }]);
