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
            var $rose = $(elem).find('.rose');
            var $bar = $(elem).find('.bar');
            var width = $rose.closest('.container').width();
            var height = $(window).height();
            var size = width > height ?  height: width;

            $rose.width(size);
            $bar.width(size);
            if(width > height) {
              $rose.height(size * .55);
              $bar.height(size * .20);
            } else {
              $rose.height(size * .80);
              $bar.height(size * .20);
            }

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
                        data : [$scope.rose.label]
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
