angular.module('app')
  .directive("scrollify", [function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
          console.log(attrs.scrollify);
          $.scrollify({
            section : attrs.scrollify,
          });
        }
    }
  }])
  .directive('scrollNext', [function() {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
        console.log('here!!!!!');
        elem.bind('click', function() {
            $.scrollify.next();
        });
      }
    }
  }]);
