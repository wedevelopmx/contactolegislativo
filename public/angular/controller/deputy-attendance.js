angular.module('app')
  .controller('DeputyAttendanceController', ['$scope', 'Deputy', 'Party', 'Chamber', 'Chart',
    function($scope, Deputy, Party, Chamber, Chart) {
    $scope.rating = { full: [1, 1, 1], half: [1], empty: [0]};

    // A = Asistencia por sistema
    // AO = Asistencia por Comisión Oficial
    // PM = Permiso de Mesa Directiva
    // IV = Inasistencia por Votaciones
    // AC = Asistencia por cédula
    // IJ = Inasistencia justificada
    // I = Inasistencia
    Deputy.attendance({ deputyId: $scope.deputyId }, function(attendance) {
      grouping = [['A', 'AO', 'PM', 'IV'],
                  ['AC', 'IJ', 'I']];

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
