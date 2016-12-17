angular.module('app')
  .controller('DeputyController', ['$scope', '$routeParams', 'Deputy', function($scope, $routeParams, Deputy) {
    $scope.deputyId = $routeParams.id;

    Deputy.get({ deputyId: $routeParams.id }, function(deputy) {
      $scope.deputy = deputy;
      console.log(deputy);
    });
  }]);
