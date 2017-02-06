angular.module('app')
  .controller('PartyBudgetController', ['$rootScope', '$scope', function($rootScope, $scope) {

    $scope.$on('district-loaded', function() {
      $scope.tweetText =
        'Queremos devolverle los partidos a las personas. @' + $scope.deputy.twitter +
        ', tu me representas y quiero que apoyes %23SinVotoNoHayDinero sinvotonohaydinero.mx';

      $scope.mailSubject = 'Tu me representas y quiero que apoyes %23SinVotoNoHayDinero';
      $scope.mailBody = 'Queremos devolverle los partidos a las personas. Dip.' + $scope.deputy.displayName +
        ', tu me representas y quiero que apoyes %23SinVotoNoHayDinero sinvotonohaydinero.mx';

      $scope.hasParty = true;
      if($scope.deputy.party == "pan") {
        //Partido Acción Nacional ,791060175
        $scope.budget = '$791,060,175';
      } else if($scope.deputy.party == "pri") {
        //Partido Revolucionario Institucional ,1043302925
        $scope.budget = '$1,043,302,925';
      } else if($scope.deputy.party == "pve") {
        //Partido Verde Ecologista de México ,356997830
        $scope.budget = '$356,997,830';
      } else if($scope.deputy.party == "prd") {
        //Partido de la Revolución Democrática ,477648679
        $scope.budget = '$477,648,679';
      } else if($scope.deputy.party == "morena") {
        //Morena ,400849652
        $scope.budget = '$400,849,652';
      } else if($scope.deputy.party == "movimiento ciudadano") {
        //Movimiento Ciudadano ,331566510
        $scope.budget = '$331,566,510';
      } else if($scope.deputy.party == "panal") {
        //Nueva Alianza ,258750925
        $scope.budget = '$258,750,925';
      } else if($scope.deputy.party == "encuentro") {
        //Encuentro Social ,245942944
        $scope.budget = '$245,942,944';
      } else {
        $scope.budget = '$4,138,727,087'
        $scope.hasParty = false;
      }
      //Partido del Trabajo,232607447

    });




  }]);
