angular.module('app')
  .directive('rose', ['ChartDimentions', function(ChartDimentions) {
    var barItemStyle = {
      normal: {
        label : {
          show: true,
          formatter: "{c}",
          position: 'insideTop',
          textStyle: {
            fontSize: 16,
            align: 'center'
          }
        }
      }
    };

    var selectedItemStyle =  {
        normal : {
            label : {
                show : true,
                formatter: "{b} {a}",
                textStyle: {
                  fontSize: 16
                }
            },
            labelLine : {
                show : true
            }
        },
        emphasis : {
            label : {
                show : false,
            },
            labelLine : {
                show : false
            }
        }
    };

    var mediaItemStyle =  {
        normal : {
            label : {
                show : true,
                formatter: "Media {b} {a}",
                textStyle: {
                  fontSize: 16
                }
            },
            labelLine : {
                show : true
            }
        },
        emphasis : {
            label : {
                show : false,
            },
            labelLine : {
                show : false
            }
        }
    };

    return {
      restrict: "A",
      scope: {
        rose: '=rose'
      },
      link: function($scope, elem, attrs) {

        $scope.$watch('rose', function() {
          if($scope.rose != undefined) {
            ChartDimentions.init();
            var $rose = $(elem).find('.rose');
            var $bar = $(elem).find('.bar');
            var fit = ChartDimentions.calculateFit($rose);
            var size = fit.width;

            var fontSize = ChartDimentions.find('fontSize');
            mediaItemStyle.normal.label.textStyle.fontSize = fontSize;
            selectedItemStyle.normal.label.textStyle.fontSize = fontSize;
            barItemStyle.normal.label.textStyle.fontSize = fontSize;

            $rose.width(fit.width);
            $bar.width(fit.width);
            $rose.height(fit.height);
            $bar.height(fit.height);

            $scope.rose.rose.forEach(function(item) {
              if(item.selected) {
                item.itemStyle = selectedItemStyle
              } else if(item.media) {
                item.itemStyle = mediaItemStyle
              }
            });

            $rose.chart({
                tooltip : {
                    trigger: 'item',
                    formatter: "{b} {a} : {c} Diputados ({d}%)"
                },
                calculable : true,
                series : [
                    {
                        name: $scope.rose.label,
                        type:'pie',
                        radius : [20, size/4],
                        center : ['50%', '50%'],
                        roseType : 'radius',
                        width: '80%',       // for funnel
                        max: 40,            // for funnel
                        itemStyle : {
                            normal : {
                                label : {
                                    show : false,
                                    textStyle: {
                                      fontSize: fontSize
                                    }
                                },
                                labelLine : {
                                    show : false
                                }
                            },
                            emphasis : {
                                label : {
                                    show : true,
                                    formatter: "{b} {a}",
                                    textStyle: {
                                      fontSize: fontSize
                                    }
                                },
                                labelLine : {
                                    show : true
                                }
                            }
                        },
                        data:$scope.rose.rose
                    }
                ]
            }); //Chart End

            $bar.chart({
                tile: { show: false },
                grid: { height: "70%" },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                calculable : false,
                xAxis : [
                    {
                        type : 'value',
                        max: $scope.rose.total
                    }
                ],
                yAxis : [
                    {
                        type : 'category',
                        data : [$scope.rose.label],
                        axisLabel: { show: false }
                    }
                ],
                series : [
                    {
                        name:'Menor',
                        type:'bar',
                        stack: 'group 1',
                        barMinHeight: 40,
                        itemStyle : barItemStyle,
                        data:[$scope.rose.bar[0]]
                    },
                    {
                        name:'Igual',
                        type:'bar',
                        stack: 'group 1',
                        itemStyle : barItemStyle,
                        data:[$scope.rose.bar[1]]
                    },
                    {
                        name:'Mejor',
                        type:'bar',
                        stack: 'group 1',
                        itemStyle : barItemStyle,
                        data:[$scope.rose.bar[2]]
                    }
                ]
            });
          }
        });
      }
    }
  }]);
