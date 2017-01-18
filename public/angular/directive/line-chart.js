angular.module('app')
  .directive('line', [function() {

    axisLine = {
      lineStyle: {
        width: 2,
          color: '#F8BBD0'
      }
    };

    axisTick =  {
      lineStyle: {
        color: '#F8BBD0'
      }
    };

    axisLabel = {
      textStyle: {
        color: '#F8BBD0'
      }
    };

    axisPointer = {
      type: 'line',
      lineStyle: {
          color: '#FFFFFF',
          width: 2,
          type: 'solid'
      },
      crossStyle: {
          color: '#1e90ff',
          width: 1,
          type: 'dashed'
      },
    };

    itemStyle = {
      normal: {
        lineStyle: {
          width: 2,
          color: '#FFFFFF'
        }
      }
    };

    markPointItemStyle = {
     normal: {
       color: '#FFFFFF',
       label: {
         textStyle: { color: '#F50056'}
       }
     }
    };

    markPointAgvItemStyle = {
      normal: {
        color: '#FFFFFF',
        label: {
          textStyle: { color: '#F50056'}
        }
      }
    };

    item = {
      value: 0,
      itemStyle: {
          normal: {
              color: '#000000'
          }
       }
    };

    markItem = {
      value: 14,
      symbol: 'star5',
      symbolSize : 20,
      itemStyle: {
          normal: {
              color: '#FFC107',
              label : {
                  show: true,
                  position: 'inside',
                  textStyle: {
                    color: '#FFFFFF'
                  }
              }
          },
          emphasis: {
              color: 'orange',
              label : {
                  show: true,
                  position: 'inside',
                  textStyle : {
                      fontSize : '20'
                  }
              }
          }
      }
    };

    return {
      restrict: "A",
      scope: {
        line: '=line'
      },
      link: function($scope, elem, attrs) {

        $scope.$watch('line', function() {
          if($scope.line != undefined) {
            var $chart = $(elem).find('.chart');
            var size = $(window).width() > $(window).height() ?  $(window).height(): $(window).width();
            $chart.width(size * .9);
            $chart.height(size * .9);

            $scope.data = $scope.line.data.map(function(item) {
              result = {};
              if(item.selected) {
                result = angular.copy(markItem);
              } else {
                result = angular.copy(item);
              }
              result.value = item.value;
              return result;
            });

            $chart.chart({
                tooltip : {
                    trigger: 'axis',
                    axisPointer: axisPointer
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        axisLine: axisLine,
                        axisTick: axisTick,
                        axisLabel: axisLabel,
                        data : $scope.line.legend
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisLine: axisLine,
                        axisTick: axisTick,
                        axisLabel : {
                            textStyle: {
                              color: '#F8BBD0'
                            },
                            formatter: '{value}'
                        }
                    }
                ],
                series : [
                    {
                        name:'Asistencias',
                        type:'line',
                        itemStyle: itemStyle,
                        data: $scope.data,
                        markPoint : {
                            data : [
                                { type : 'max', name: 'Mayor', itemStyle: markPointItemStyle },
                                { type : 'min', name: 'Menor', itemStyle: markPointItemStyle }
                            ]
                        },
                        markLine : {
                            data : [
                                {
                                  type : 'average',
                                  name: 'Promedio',
                                  itemStyle: markPointAgvItemStyle
                                }
                            ]
                        }
                    }
                ]
            });

          }
        });
      }
    }
  }]);
