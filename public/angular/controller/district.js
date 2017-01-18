angular.module('app')
  .controller('DistrictController', ['$rootScope', '$scope', '$routeParams', 'District', function($rootScope, $scope, $routeParams, District) {
    $scope.deputyId = $routeParams.id;

    $scope.party = {
      attendance:[]
    };
    $scope.chamber = {
      attendance: []
    };

    District.get({ districtId: $routeParams.id }, function(district) {
      $scope.district = district;
      $scope.deputy = district[0];
      $rootScope.$broadcast('district-loaded');
    });

    $scope.attendanceOptions = {
      title: 'Asistencias',
      subtitle: ''
    };


  }]);
