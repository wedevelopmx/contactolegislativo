angular.module('app')
  .directive("scrollify", [function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
          $.scrollify.destroy();
          $.scrollify({
            section : attrs.scrollify,
            updateHash: false,
            before: function(index, sections) {
              $(sections[index]).find('.animated').addClass("fadeIn");
            },
            after: function(index, sections) {
              $(sections[index]).find('.animated').removeClass("fadeIn");
            }
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
