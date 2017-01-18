angular.module('app')

  .controller('DeputyController', ['$rootScope', '$scope', '$routeParams', 'Deputy', function($rootScope, $scope, $routeParams, Deputy) {
    $scope.deputyId = $routeParams.id;

    $scope.party = {
      attendance:[]
    };
    $scope.chamber = {
      attendance: []
    };

    Deputy.get({ deputyId: $routeParams.id }, function(deputy) {
      $scope.deputy = deputy;
      $rootScope.$broadcast('deputy-loaded');
    });

    // //Initiatives
    // Deputy.initiatives({ deputyId: $routeParams.id }).$promise.then(function(initiatives) {
    //   console.log(initiatives);
    //   data = [];
    //   total = 0;
    //   for(i = 0; i < initiatives.length; i++){
    //     data.push([initiatives[i]]);
    //     total += initiatives[i].value;
    //   }
    //
    //   $scope.initiativesOptions = {
    //     title: 'Initiatives',
    //     subtitle: '',
    //     data: data,
    //     total: total
    //   };
    // });
    //
    // //Votes
    // Deputy.votes({ deputyId: $routeParams.id }).$promise.then(function(votes) {
    //   console.log(votes);
    //   hash = {};
    //   data = [];
    //   total = 0;
    //   for(i = 0; i < votes.length; i++){
    //     if(!hash.hasOwnProperty(votes[i].periodo)) {
    //         hash[votes[i].periodo] = { data: [] };
    //         data.push(hash[votes[i].periodo].data);
    //         hash[votes[i].periodo].data.legend = votes[i].periodo;
    //         hash[votes[i].periodo].data.total = 0;
    //     }
    //
    //     hash[votes[i].periodo].data.push({ name: votes[i].name, value: votes[i].value});
    //     hash[votes[i].periodo].data.total += votes[i].value;
    //     if( total < hash[votes[i].periodo].data.total)
    //       total = hash[votes[i].periodo].data.total;
    //   }
    //
    //   $scope.votesOptions = {
    //     title: 'Votos',
    //     subtitle: '',
    //     data: data,
    //     total: total
    //   };
    //
    // });

    $scope.attendanceOptions = {
      title: 'Asistencias',
      subtitle: ''
    };

    $scope.initiativesOptions = {
      title: 'Iniciativas',
      subtitle: ''
    };

    $scope.votesOptions = {
      title: 'Votes',
      subtitle: ''
    };

  }]);
