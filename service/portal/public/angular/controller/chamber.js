angular.module('app')
  .controller('ChamberController', ['$scope', 'Chamber', function($scope, Chamber) {
    $scope.deputies = [];

    var parse = function(source) {
      return source.map(function(item) { return item; });
    }

    Chamber.query({offset: 0, limit: 10 }, function(deputies) {
      $scope.deputies = $scope.deputies.concat(parse(deputies));
      Chamber.query({offset: 10, limit: 1002 }, function(deputies) {
        $scope.deputies = $scope.deputies.concat(parse(deputies));
        console.log($scope.deputies)
      });
    });
  }]);

  // $(document).ready(function() {
  //     $('.table').DataTable();
  // } );
