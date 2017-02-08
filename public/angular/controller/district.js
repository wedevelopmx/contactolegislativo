angular.module('app')
  .controller('DistrictController', ['$rootScope', '$scope', '$routeParams', 'District', function($rootScope, $scope, $routeParams, District) {
    $scope.deputyId = $routeParams.id;

    $scope.party = {
      attendance:[]
    };
    $scope.chamber = {
      attendance: []
    };

    $scope.facebookShare = {
      url: 'http://representame.pokemongrind.com',
      title: '¿Sabes que diputado te representa?'
    };

    District.get({ districtId: $routeParams.id }, function(district) {
      $scope.district = district;
      $scope.deputy = district[0];
      console.log($scope.deputy)

      $scope.tweetText = '@' + $scope.deputy.twitter + ' los ciudadanos queremos que seas un %23FuncionarioTransparente y publiques tus %233de3 @IMCOmx @IntegridadMx'

      $scope.mailSubject = 'Tu me representas y estoy al pendiente de su desempeño en %23contactoLegislativo';
      $scope.mailBody = 'Dip.' + $scope.deputy.displayName +
        ', tu me representas y estoy al pendiente de su desempeño en %23contactoLegislativo';

      $scope.mail3Subject = 'Tu me representas y quiero que publiques tu %233de3';
      $scope.mail3Body = 'Dip.' + $scope.deputy.displayName +
        ', los ciudadanos queremos que seas un %23FuncionarioTransparente y publiques tus %233de3 @IMCOmx @IntegridadMx';


      $rootScope.$broadcast('district-loaded');
    });

    $scope.attendanceOptions = {
      title: 'Asistencias',
      subtitle: ''
    };


  }]);
