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
      console.log($scope.deputy)
      $scope.tweetText = '@' + $scope.deputy.twitter + ' los ciudadanos queremos que seas un %23FuncionarioTransparente y publiques tus %233de3 @IMCOmx @IntegridadMx'
      $rootScope.$broadcast('district-loaded');
    });

    $scope.attendanceOptions = {
      title: 'Asistencias',
      subtitle: ''
    };


  }]);
