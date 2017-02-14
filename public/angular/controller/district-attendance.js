angular.module('app')
  .controller('DistrictAttendanceController', ['$scope', 'District', 'Party', 'Chamber', 'Chart',
    function($scope, District, Party, Chamber, Chart) {
    $scope.rating = { full: [1, 1, 1], half: [1], empty: [1]};

    $scope.$watch('deputy', function() {
      if($scope.deputy != undefined) {
        $scope.tweetText = 'Diputado @' + $scope.deputy.twitter + ' usted me representa, y estoy al pendiente de su desempeño en %23contactoLegislativo contactolegislativo.com';

        // A = Asistencia por sistema
        // AO = Asistencia por Comisión Oficial
        // PM = Permiso de Mesa Directiva
        // IV = Inasistencia por Votaciones
        // AC = Asistencia por cédula
        // IJ = Inasistencia justificada
        // I = Inasistencia
        District.attendance({ districtId: $scope.deputyId }, function(attendance) {
          grouping = [['A', 'AO', 'PM', 'IV'],
                      ['AC', 'IJ', 'I']];

          //Attendance Graph
          $scope.attendance = attendance;
          $scope.attendancePie = Chart.sortPie(grouping, attendance);
          $scope.deputy.attendance = $scope.attendancePie[0].total;
          $scope.attendanceGauge = { deputy: $scope.deputy.attendance, partyName: $scope.deputy.party, max: $scope.attendancePie.total, resp: 0 };
          //console.log($scope.attendancePie);

          //Generate rate
          $scope.rate = Math.round(($scope.deputy.attendance / (2 * $scope.attendancePie.total)) * 100);
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
          Chamber.attendance({}, function(attendance) {
            $scope.chamber.attendance = attendance;

            ranges = { 0: 80, 81: 85, 86: 90, 91: 95, 96: 100, 101:101, 102:102, 103:103, 104:104};
            $scope.chamber.attendanceChart = Chart.groupData(attendance, ranges, $scope.deputy.attendance, 'Asistencias');

            $scope.attendanceGauge.chamber = $scope.chamber.attendanceChart.media;
            $scope.attendanceGauge.resp ++;
            //console.log($scope.chamber.attendanceChart);
          });

          //Query chamber party attendance
          Chamber.attendance({party: $scope.deputy.party}, function(attendance) {
            $scope.chamber.party = { attendance : Chart.calculateMedia(attendance) } ;
            $scope.attendanceGauge.party = $scope.chamber.party.attendance.media;
            $scope.attendanceGauge.resp ++;
            //console.log($scope.chamber.party.attendance);
          });

          //Query chamber 'Representación proporcional' aka Plurinominales
          Chamber.attendance({election: 'Representación proporcional'}, function(attendance) {
            $scope.chamber.pluri = { attendance : Chart.calculateMedia(attendance) };
            $scope.attendanceGauge.pluri = $scope.chamber.pluri.attendance.media;
            $scope.attendanceGauge.resp ++;
            //console.log($scope.attendanceGauge);
          });

        });
      }
    });

  }]);
