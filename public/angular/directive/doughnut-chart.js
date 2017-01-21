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
            label: {show:false, textStyle: { color: '#212121' } },
            labelLine: {show:false, lineStyle: { color: '#212121' } }
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
          var width = $chart.closest('.container').width();
          var height = $(window).height();
          var size = width > height ?  height: width;
          $chart.width(size);
          $chart.height(size * .85);

          options.legend.x = size * .45;
          options.legend.y = size / 12;

          index = 1;
          size = size / 3;
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
                center: ["41%", "50%"],
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
