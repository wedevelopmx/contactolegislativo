angular.module('app')
  .directive('doughnut', [function() {
    var title = {
        text: 'Pie doughnut',
        subtext: '',
        sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
        x: 'center',
        y: 'center',
        itemGap: 20,
        textStyle : {
            color : 'rgba(30,144,255,0.8)',
            fontSize : 35,
            fontWeight : 'bolder'
        }
    };

    var dataStyle = {
        normal: {
            label: {show:false},
            labelLine: {show:false}
        },
        emphasis : {
            label : {
                show : true,
                position : 'center',
                textStyle : {
                    fontSize : '30',
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
        var options = {
            tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient : 'vertical',
                x : 100,
                y : 45,
                itemGap:12,
                data:['68% Asistencias','29% Justificadas','3% Faltas']
            },
            series : []
        };

        $scope.$watch('doughnut', function() {
          var $chart = $(elem).find('.chart');
          var size = $(window).width() > $(window).height() ?  $(window).height(): $(window).width();
          $chart.width(size * .9);
          $chart.height(size * .9);

          options.legend.x = size / 2;
          options.legend.y = size / 12;

          index = 1;
          size = size / 2.25;
          radius = size / (2 * ($scope.doughnut ? $scope.doughnut.length : 1));
          legend =[];
          hashLegend = {};

          if($scope.doughnut != null) { 
            $scope.doughnut.forEach(function(row) {
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

              data.push({
                value: p,
                name:'invisible',
                itemStyle : placeHolderStyle
              });

              options.series.push({
                name: row.legend,
                type:'pie',
                clockWise:false,
                radius : [size - radius, size],
                itemStyle : dataStyle,
                data: data
              });

              size -= radius; index++;
            });
          }
          options.legend.data = legend;

          $chart.chart(options);
        });
      }
    }
  }]);
