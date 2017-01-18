angular.module('app')
  .directive('rainbow', [function() {

    return {
      restrict: "A",
      scope: {
        rainbow: '=rainbow'
      },
      link: function($scope, elem, attrs) {

        $scope.$watch('rainbow.data', function() {
          var options = {
            // title: {
            //     x: 'center',
            //     text: 'Title',
            //     subtext: 'Rainbow bar example',
            //     link: 'http://representa.me'
            // },
            tooltip: {
                trigger: 'item'
            },
            grid: {
                borderWidth: 0,
                y: 80,
                y2: 60
            },
            xAxis: [
                {
                    type: 'category',
                    show: false,
                    data: ['5 Faltas', '6 Faltas', '7 Faltas', '9 Faltas']
                }
            ],
            yAxis: [{ type: 'value', show: false}],
            series: [
                {
                    name: '',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: function(params) {
                                // build a color map as your need.
                                var colorList = [
                                  '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                                   '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                   '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                                ];
                                return colorList[params.dataIndex]
                            },
                            label: {
                                show: true,
                                position: 'top',
                                formatter: '{b}'
                            }
                        }
                    },
                    data: [5,6,8,9]
                }
            ]
          };

          var $chart = $(elem).find('.chart');
          var size = $(window).width() > $(window).height() ?  $(window).height(): $(window).width();
          $chart.width(size * .9);
          $chart.height(size * .9);

          $chart.chart(options);
        });
      }
    }
  }]);
