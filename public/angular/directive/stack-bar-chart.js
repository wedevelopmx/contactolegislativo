angular.module('app')
  .directive('stack', ['ChartDimentions', function(ChartDimentions) {

    var itemStyle = {
      normal: {
        color: function(params) {
            // build a color map as your need.
            var colorList = [
              '#66BB6A','#FFEE58','#4FC3F7','#EF5350',
              '#DCE775','#FFA726','#FF7043','#D7CCC8'
            ];
            return colorList[params.seriesIndex]
        },
        label : {
          show: true,
          position: 'insideRight'
        }
      }
    };

    return {
      restrict: "A",
      scope: {
        stack: '=stack'
      },
      link: function($scope, elem, attrs) {

        $scope.$watch('stack.legend', function() {
          //console.log($scope.stack);
          if($scope.stack != undefined) {
            ChartDimentions.init();
            var $chart = $(elem).find('.chart');
            var fit = ChartDimentions.calculateFit($chart);
            var size = fit.width;
            $chart.width(fit.width);
            $chart.height(fit.height);

            var fontSize = ChartDimentions.find('fontSize');

            var options = {
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data: $scope.stack.legend
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        data : $scope.stack.xAxis
                    }
                ],
                yAxis : [
                    {
                      type : 'value'
                    }
                ],
                series : [
                    {
                        name:'Aprobada',
                        type:'bar',
                        stack: 'Stack',
                        itemStyle : itemStyle,
                        data: $scope.stack.series['aprobada']
                    },
                    {
                        name:'Pendiente',
                        type:'bar',
                        stack: 'Stack',
                        itemStyle : itemStyle,
                        data:$scope.stack.series['pendiente']
                    },
                    {
                        name:'Retirada',
                        type:'bar',
                        stack: 'Stack',
                        itemStyle : itemStyle,
                        data: $scope.stack.series['retirada']
                    },
                    {
                        name:'Desechada',
                        type:'bar',
                        stack: 'Stack',
                        itemStyle : itemStyle,
                        data: $scope.stack.series['desechada']
                    }
                ]
            };


            $chart.chart(options);
          }
        });
      }
    }
  }]);
