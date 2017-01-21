angular.module('app')
  .directive('gauge', [function() {


    return {
      restrict: "A",
      scope: {
        gauge: '=gauge'
      },
      link: function($scope, elem, attrs) {

        $scope.$watch('gauge.resp', function() {
          if($scope.gauge && $scope.gauge.resp == 3) {
            var $chart = $(elem).find('.chart');
            var width = $chart.closest('.container').width();
            var height = $(window).height();
            var size = width > height ?  height: width;
            $chart.width(size);
            $chart.height(size * .6);

            $chart.chart({
                tooltip : {
                    formatter: "{a} <br/>{c} {b}"
                },
                series : [
                    {
                        name:'速度',
                        type:'gauge',
                        radius : '65%',
                        z: 3,
                        min:0,
                        max:$scope.gauge.max,
                        splitNumber:10,
                        axisLine: {            // 坐标轴线
                            lineStyle: {       // 属性lineStyle控制线条样式
                                width: 6
                            }
                        },
                        axisTick: {            // 坐标轴小标记
                            length :10,        // 属性length控制线长
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: 'auto'
                            }
                        },
                        splitLine: {           // 分隔线
                            length :15,         // 属性length控制线长
                            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                color: 'auto'
                            }
                        },
                        title : {
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'bolder',
                                fontSize: 20,
                                fontStyle: 'italic'
                            }
                        },
                        detail : {
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
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
                        max:$scope.gauge.max,
                        endAngle:45,
                        splitNumber:4,
                        axisLine: {            // 坐标轴线
                            lineStyle: {       // 属性lineStyle控制线条样式
                                width: 5
                            }
                        },
                        axisTick: {            // 坐标轴小标记
                            length :10,        // 属性length控制线长
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: 'auto'
                            }
                        },
                        splitLine: {           // 分隔线
                            length :15,         // 属性length控制线长
                            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                color: 'auto'
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
                        max:$scope.gauge.max,
                        startAngle:135,
                        endAngle:-45,
                        splitNumber:4,
                        axisLine: {            // 坐标轴线
                            lineStyle: {       // 属性lineStyle控制线条样式
                                width: 5
                            }
                        },
                        axisTick: {            // 坐标轴小标记
                            length :10,        // 属性length控制线长
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: 'auto'
                            }
                        },
                        splitLine: {           // 分隔线
                            length :15,         // 属性length控制线长
                            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                color: 'auto'
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
