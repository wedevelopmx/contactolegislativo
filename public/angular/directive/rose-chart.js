angular.module('app')
  .directive('rose', [function() {
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

            var size = $(window).width() > $(window).height() ?  $(window).height(): $(window).width();
            var $rose = $(elem).find('.rose');
            var $bar = $(elem).find('.bar');
            $rose.width(size * .90);
            $rose.height(size * .60);
            $bar.width(size * .90);
            $bar.height(size * .20);

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
                        name:'Asistencias',
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
                                      fontSize: 16
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
                                      fontSize: 16
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
                grid: {
                  height: (size * .2)/2
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'value',
                        max: $scope.rose.total
                    }
                ],
                yAxis : [
                    {
                        type : 'category',
                        data : ['Asistencia']
                    }
                ],
                series : [
                    {
                        name:'Menor',
                        type:'bar',
                        stack: 'group 1',
                        itemStyle : { normal: {label : {show: true, formatter: "{c}", position: 'insideRight'}}},
                        data:[$scope.rose.bar[0]]
                    },
                    {
                        name:'Igual',
                        type:'bar',
                        stack: 'group 1',
                        itemStyle : { normal: {label : {show: true, formatter: "{c}", position: 'insideRight'}}},
                        data:[$scope.rose.bar[1]]
                    },
                    {
                        name:'Mejor',
                        type:'bar',
                        stack: 'group 1',
                        itemStyle : { normal: {label : {show: true, formatter: "{c}", position: 'insideRight'}}},
                        data:[$scope.rose.bar[2]]
                    }
                ]
            });
          }
        });
      }
    }
  }]);
