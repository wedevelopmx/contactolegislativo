angular.module('app')
  .directive("scrollify", ['$timeout', function($timeout) {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
          $timeout(function() {
            $.scrollify.destroy();
            $.scrollify({
              section : attrs.scrollify,
              updateHash: false,
              touchScroll: true,
              before: function(index, sections) {
                $(sections[index]).find('.animated').addClass("fadeIn");
              },
              after: function(index, sections) {
                $(sections[index]).find('.animated').removeClass("fadeIn");
              }
            });
            $.scrollify.move("#first");
          }, 2000);
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
