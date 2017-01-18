angular.module('app')
  .controller('DistrictAttendanceController', ['$scope', 'District', 'Party', 'Chamber', 'Chart',
    function($scope, District, Party, Chamber, Chart) {
    $scope.rating = { full: [1, 1, 1], half: [1], empty: [0]};

    District.attendance({ deputyId: $scope.deputyId }, function(attendance) {
      grouping = [['ASISTENCIA', 'OFICIAL COMISIÓN', 'PERMISO MESA DIRECTIVA'],
                  ['JUSTIFICADA', 'INASISTENCIA', 'CÉDULA']];

      //Attendance Graph
      $scope.attendance = attendance;
      $scope.attendancePie = Chart.sortPie(grouping, attendance);
      $scope.deputy.attendance = $scope.attendancePie.total;


      Chamber.attendance({}, function(attendance) {
        $scope.chamber.attendance = attendance;
        $scope.chamber.attendanceChart = Chart.sortLinePercentage(attendance, $scope.deputy.attendance);
        console.log($scope.chamber.attendanceChart);
      });

    });

    $scope.$on('deputy-loaded', function(evt, args) {
      //Attendance comparison
      Party.attendance({ party: 'pan'}, function(attendance) {
        $scope.party.attendance = attendance;
        for(i = 0; i< attendance.length; i++) {
          if(attendance[i].name == $scope.deputy.asistencia)
            console.log(attendance[i]);
        }
      });
    });

  }]);
