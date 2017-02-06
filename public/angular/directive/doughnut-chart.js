angular.module('app')
  .directive('doughnut', ['ChartDimentions', function(ChartDimentions) {
    var dataStyle = {
        normal: {
            label: {show:false, textStyle: { color: '#212121' } },
            labelLine: {show:false, lineStyle: { color: '#212121' } }
        },
        emphasis : {
            label : {
                show : true,
                position : 'center',
                textStyle : {
                    fontSize : '24',
                    fontWeight : 'bold'
                }
            }
        }
    };

    var placeHolderStyle = {
        normal : {
            color: 'rgba(0,0,0,0)',
            label: {show:false},
            labelLine: {show:false}
        },
        emphasis : {
            color: 'rgba(0,0,0,0)'

        }
    };

    return {
      restrict: "A",
      scope: {
        doughnut: '=doughnut'
      },
      link: function($scope, elem, attrs) {
        $scope.$watch('doughnut', function() {
          if($scope.doughnut != undefined && $scope.doughnut.length > 0) {
            ChartDimentions.init();
            dataStyle.emphasis.label.textStyle.fontSize = ChartDimentions.find('headingSize');


            var $chart = $(elem).find('.chart');
            var fit = ChartDimentions.calculateFit($chart);
            var size = fit.width;
            $chart.width(fit.width);
            $chart.height(fit.height);

            size = size / 3;
            radius = size / (2 * ($scope.doughnut ? $scope.doughnut.length : 1));
            legend =[];
            series = [];
            hashLegend = {};
            $scope.doughnut.forEach(function(row, index) {
              p = $scope.doughnut.total * 1.2;
              data = [];

              row.forEach(function(column) {
                if(!hashLegend.hasOwnProperty(column.name)) {
                  hashLegend[column.name] = true;
                  legend.push(column.name);
                }
                data.push(column);
                p-= column.value;
              });

              data.push({ value: p, name:'NA', itemStyle : placeHolderStyle });

              series.push({
                name: row.legend,
                type:'pie',
                clockWise:false,
                center: ["41%", "50%"],
                radius : [size - radius, size],
                itemStyle : dataStyle,
                data: data
              });

              size -= radius;
            });

            size = fit.width;
            //Draw the charts
            $chart.chart({
                tooltip : {
                  trigger: 'item',
                  formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient : 'vertical',
                    x : "45%",
                    y : "15%",
                    itemGap: 12,
                    data: legend,
                    textStyle: { fontSize: ChartDimentions.find('fontSize') }
                },
                series : series
            });
          }
        });
      }
  };

}]);
