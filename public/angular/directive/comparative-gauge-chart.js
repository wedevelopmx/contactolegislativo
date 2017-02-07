angular.module('app')
  .directive('gauge', ['ChartDimentions', function(ChartDimentions) {


    return {
      restrict: "A",
      scope: {
        gauge: '=gauge'
      },
      link: function($scope, elem, attrs) {

        $scope.$watch('gauge.resp', function() {
          if($scope.gauge && $scope.gauge.resp == 3) {
            ChartDimentions.init();

            var $chart = $(elem).find('.chart');

            var fit = ChartDimentions.calculateFit($chart);
            
            $chart.width(fit.width);
            $chart.height(fit.width * .5);

            var graphMax = ($scope.gauge.deputy > $scope.gauge.party ? $scope.gauge.deputy : $scope.gauge.party );
            graphMax = (graphMax > $scope.gauge.pluri ? graphMax : $scope.gauge.pluri );
            graphMax = Math.ceil(graphMax);

            $chart.chart({
                tooltip : {
                    formatter: "{a} <br/>{c} {b}"
                },
                series : [
                    {
                        name:'Diputado',
                        type:'gauge',
                        radius : '65%',
                        z: 3,
                        min:0,
                        max:graphMax,
                        splitNumber:8,
                        axisLine: {
                            lineStyle: {
                                width: ChartDimentions.find('axisLine')
                            }
                        },
                        axisTick: {
                            length : ChartDimentions.find('axisTick')
                        },
                        splitLine: {
                            length :ChartDimentions.find('splitLine')
                        },
                        title : {
                            textStyle: {
                                fontWeight: 'bolder',
                                fontSize: ChartDimentions.find('headingSize'),
                                fontStyle: 'italic'
                            }
                        },
                        detail : {
                            textStyle: {
                                fontWeight: 'bolder'
                            }
                        },
                        data:[{value: $scope.gauge.deputy, name: 'Diputado'}]
                    },
                    {
                        name:'转速',
                        type:'gauge',
                        center : ['20%', '55%'],    // 默认全局居中
                        radius : '55%',
                        min:0,
                        max:graphMax,
                        endAngle:45,
                        splitNumber:4,
                        axisLine: {
                            lineStyle: {
                                width: ChartDimentions.find('axisLine')
                            }
                        },
                        axisTick: {
                            length : ChartDimentions.find('axisTick')
                        },
                        splitLine: {
                            length :ChartDimentions.find('splitLine')
                        },
                        title : {
                            textStyle: {
                                fontWeight: 'bolder',
                                fontSize: ChartDimentions.find('headingSize'),
                                fontStyle: 'italic'
                            }
                        },
                        detail : {
                            textStyle: {
                                fontWeight: 'bolder'
                            }
                        },
                        pointer: {
                            width:4
                        },
                        title : {
                            offsetCenter: [0, '30%'],       // x, y，单位px
                        },
                        detail : {
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'bolder'
                            }
                        },
                        data:[{value: $scope.gauge.party.toFixed(1), name: $scope.gauge.partyName}]
                    },
                    {
                        name:'油表',
                        type:'gauge',
                        center : ['80%', '55%'],    // 默认全局居中
                        radius : '55%',
                        min:0,
                        max:graphMax,
                        startAngle:135,
                        endAngle:-45,
                        splitNumber:4,
                        axisLine: {
                            lineStyle: {
                                width: ChartDimentions.find('axisLine')
                            }
                        },
                        axisTick: {
                            length : ChartDimentions.find('axisTick')
                        },
                        splitLine: {
                            length :ChartDimentions.find('splitLine')
                        },
                        title : {
                            textStyle: {
                                fontWeight: 'bolder',
                                fontSize: ChartDimentions.find('headingSize'),
                                fontStyle: 'italic'
                            }
                        },
                        detail : {
                            textStyle: {
                                fontWeight: 'bolder'
                            }
                        },
                        pointer: {
                            width:4
                        },
                        title : {
                            offsetCenter: [0, '30%'],
                        },
                        detail : {
                            textStyle: {
                                fontWeight: 'bolder'
                            }
                        },
                        data:[{value: $scope.gauge.pluri.toFixed(1), name: 'Pluri'}]
                    }
                ]
            });
          }
      });
// clearInterval(timeTicket);
// timeTicket = setInterval(function (){
//     option.series[0].data[0].value = (Math.random()*100).toFixed(2) - 0;
//     option.series[1].data[0].value = (Math.random()*7).toFixed(2) - 0;
//     option.series[2].data[0].value = (Math.random()*2).toFixed(2) - 0;
//     option.series[3].data[0].value = (Math.random()*2).toFixed(2) - 0;
//     myChart.setOption(option,true);
// },2000)

      }
    }
  }]);
