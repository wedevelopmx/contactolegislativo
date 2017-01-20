angular.module('app')
  .directive("scrollify", [function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
          $.scrollify({
            section : attrs.scrollify,
            updateHash: false
          });
        }
    }
  }])
  .directive('scrollNext', [function() {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
        elem.bind('click', function() {
            $.scrollify.next();
        });
      }
    }
  }]);
