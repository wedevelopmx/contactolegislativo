angular.module('app')
  .controller('DistrictInitiativesController', ['$scope', 'District', 'Party', 'Chamber', 'Chart',
    function($scope, District, Party, Chamber, Chart) {
    $scope.rating = { full: [1, 1, 1], half: [1], empty: [1]};

    $scope.$on('district-loaded', function() {

      District.initiatives({ districtId: $scope.deputyId }, function(initiatives) {
        grouping = [['Proponente'],
                    ['Adherente', 'Suscribe']];

        //Attendance Graph
        $scope.initiatives = initiatives;
        $scope.initiativesPie = Chart.sortPie(grouping, initiatives);
        $scope.deputy.initiatives = $scope.initiativesPie[0].total;
        $scope.initiativesGauge = { deputy: $scope.deputy.initiatives, partyName: $scope.deputy.party, max: $scope.initiativesPie.total, resp: 0 };
        //console.log($scope.attendancePie);

        //Generate rate
        
        $scope.rate = Math.round(($scope.deputy.initiatives / (2 * $scope.initiativesPie.total)) * 100); // 2 beacuse we use 5 start not 10
        var generateIcon = function(stars) {
          r = [];
          for(var i = 0; i < stars; i ++){
            r.push(1);
          }
          return r;
        }
        $scope.rating.full = generateIcon(Math.floor($scope.rate / 10));
        $scope.rating.half = generateIcon(Math.floor(($scope.rate % 10) / 5));
        $scope.rating.empty = generateIcon(5 - Math.floor($scope.rate / 10) - Math.floor(($scope.rate % 10) / 5));
        $scope.rate /= 10;

        //Query chamber attendance
        Chamber.initiatives({}, function(initiatives) {
          $scope.chamber.initiatives = initiatives;
          $scope.chamber.initiativesChart = Chart.sortAttendanceforRose(initiatives, $scope.deputy.initiatives, 'Iniciativas');
          $scope.initiativesGauge.chamber = $scope.chamber.initiativesChart.media;
          $scope.initiativesGauge.resp ++;
          //console.log($scope.chamber.initiativesChart);
        });

        //Query chamber party attendance
        Chamber.initiatives({party: $scope.deputy.party}, function(initiatives) {
          $scope.chamber.party = { initiatives : Chart.calculateMedia(initiatives) } ;
          $scope.initiativesGauge.party = $scope.chamber.party.initiatives.media;
          $scope.initiativesGauge.resp ++;
          //console.log($scope.chamber.party.initiatives);
        });

        //Query chamber 'Representación proporcional' aka Plurinominales
        Chamber.initiatives({election: 'Representación proporcional'}, function(initiatives) {
          $scope.chamber.pluri = { initiatives : Chart.calculateMedia(initiatives) };
          $scope.initiativesGauge.pluri = $scope.chamber.pluri.initiatives.media;
          $scope.initiativesGauge.resp ++;
          //console.log($scope.initiativesGauge);
        });

      });
    });

  }]);
