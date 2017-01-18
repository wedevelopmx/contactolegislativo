angular.module('app')
  .directive('gauge', [function() {


    return {
      restrict: "A",
      scope: {
        gauge: '=gauge'
      },
      link: function($scope, elem, attrs) {

        $scope.$watch('gauge.data', function() {

          var $chart = $(elem).find('.chart');
          var size = $(window).width() > $(window).height() ?  $(window).height(): $(window).width();
          $chart.width(size * .9);
          $chart.height(size * .9);

          $chart.chart({
            tooltip : {
                formatter: "{a} <br/>{c} {b}"
            },
            series : [
                {
                    name:'速度',
                    type:'gauge',
                    radius : '40%',
                    z: 3,
                    min:0,
                    max:20,
                    splitNumber:10,
                    axisLine: {            // 坐标轴线
                        lineStyle: {       // 属性lineStyle控制线条样式
                            width: 10
                        }
                    },
                    axisTick: {            // 坐标轴小标记
                        length :15,        // 属性length控制线长
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: 'auto'
                        }
                    },
                    splitLine: {           // 分隔线
                        length :20,         // 属性length控制线长
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
                    data:[{value: 16, name: 'Diputado'}]
                },
                {
                    name:'转速',
                    type:'gauge',
                    center : ['20%', '55%'],    // 默认全局居中
                    radius : '25%',
                    min:0,
                    max:20,
                    endAngle:45,
                    splitNumber:5,
                    axisLine: {            // 坐标轴线
                        lineStyle: {       // 属性lineStyle控制线条样式
                            width: 8
                        }
                    },
                    axisTick: {            // 坐标轴小标记
                        length :12,        // 属性length控制线长
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: 'auto'
                        }
                    },
                    splitLine: {           // 分隔线
                        length :20,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            color: 'auto'
                        }
                    },
                    pointer: {
                        width:5
                    },
                    title : {
                        offsetCenter: [0, '30%'],       // x, y，单位px
                    },
                    detail : {
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontWeight: 'bolder'
                        }
                    },
                    data:[{value: 17, name: 'PAN'}]
                },
                {
                    name:'油表',
                    type:'gauge',
                    center : ['80%', '55%'],    // 默认全局居中
                    radius : '25%',
                    min:0,
                    max:20,
                    startAngle:135,
                    endAngle:-45,
                    splitNumber:5,
                    axisLine: {            // 坐标轴线
                        lineStyle: {       // 属性lineStyle控制线条样式
                            width: 8
                        }
                    },
                    axisTick: {            // 坐标轴小标记
                        length :12,        // 属性length控制线长
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: 'auto'
                        }
                    },
                    splitLine: {           // 分隔线
                        length :20,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            color: 'auto'
                        }
                    },
                    pointer: {
                        width:5
                    },
                    title : {
                        offsetCenter: [0, '30%'],
                    },
                    detail : {
                        textStyle: {
                            fontWeight: 'bolder'
                        }
                    },
                    data:[{value: 14, name: 'Pluri'}]
                }
            ]
        });
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
