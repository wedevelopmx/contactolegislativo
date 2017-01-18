angular.module('app')
  .directive('pie', [function() {

    return {
      restrict: "A",
      scope: {
        pie: '=pie'
      },
      link: function($scope, elem, attrs) {

        $scope.$watch('pie.data', function() {

          var $chart = $(elem).find('.chart');
          var size = $(window).width() > $(window).height() ?  $(window).height(): $(window).width();
          $chart.width(size * .9);
          $chart.height(size * .9);

          var options = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            series : [
                {
                    name:'Serie',
                    type:'pie',
                    radius : '60%',
                    center: ['50%', '50%'],
                    itemStyle: {
                      normal: {
                        color: function(params) {
                            // build a color map as your need.
                            var colorList = [
                              '#2196F3','#FFEE58','#FFA726','#FF5722',
                              '#DCE775','#FFA726','#FF7043','#D7CCC8'
                            ];
                            if(params.selected)
                             return '#FFFFFF';
                            else
                              return colorList[params.dataIndex]
                        },
                        label : {
                          textStyle: {
                            color: '#FFFFFF',
                            fontSize : '18',
                            fontWeight : 'bold'
                          }
                        },
                        labelLine : {
                            show : true
                        }
                      }
                    },
                    data:[
                        {value:335, name:'4/20', selected: true},
                        {value:310, name:'5/20'},
                        {value:234, name:'7/20'},
                        {value:135, name:'8/20'},
                        {value:1548, name:'9/20'}
                    ]
                }
            ]
          };

          $chart.chart(options);
        });
      }
    }
  }]);
