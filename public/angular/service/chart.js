angular.module('app')
	.factory('Chart', [function() {
	        var Chart = {
						generateIconSet: function(stars) {
		          r = [];
		          for(var i = 0; i < stars; i ++){
		            r.push(1);
		          }
		          return r;
		        },
            // Sort data result in format needed by doughnut directive
            // doughnut : [['ASISTENCIA', 'PERMISO ...', 'COMISION'], ['JUSTIFICADA', 'CEDULA', '...']]
            // data: [ { name: 'ASISTENCIA', value: 10}, { name: 'CEDULA', value: } ]
            // result: [ [ { name: 'ASISTENCIA', value: 10}, ..., total: 27 ], [...], total: 27 ]
            sortPie: function(doughnuts, data) {
              var pie = [];
              pie.total = 0;
              for(i in doughnuts) {
                doughnut = doughnuts[i];
                pie.push([]);
                pie[pie.length - 1].total = 0;
                for(j in doughnut) {
                  for(k in data) {
                    if(data[k].name == doughnut[j]) {
                      pie[pie.length - 1].push(data[k]);
                      pie[pie.length - 1].total += data[k].value;
											pie.total += data[k].value;
                    }
                  }
                }
                // if(pie.total < pie[pie.length - 1].total)
                //   pie.total = pie[pie.length - 1].total;
              }
              return pie;
            },
						// data: [{ deputies: 5 , attendance: 26, percentage: 10}, ...]
						// result: {
						//    legend: ['10%', '20%', ...]
						//		data: [{ value: 26}, {value: 27, selected: true}, { value: 28 }, ...],
						// 		milestone: 28%
						// }
						sortLinePercentage: function(data, value) {
							chart = {
								legend: [], data: [], milestone: 0, percentage: 0, media: 0
							};
							for(var i = 0; i < data.length; i++ ) {
								chart.percentage += data[i].percentage;
								chart.legend.push(chart.percentage.toFixed(1) + '%');
								chart.data.push({
									value: data[i].value,
									selected: (data[i].value == value)
								});
								// chart.legend.push(data[i].value);
								// chart.data.push({
								// 	value: data[i].deputies,
								// 	selected: (data[i].value == value)
								// });
								if(data[i].value == value) {
									chart.milestone = chart.percentage.toFixed(2);
								}
								chart.media += data[i].value;
							}
							chart.media /= data.length;
							chart.media = chart.media.toFixed(2);
							return chart;
						},
						isSelected: function(range, value) {
						  var regex = /(<|>)([0-9]+)|([0-9]+)-([0-9]+)|([0-9]+)/.exec(range);
						  if(regex != undefined) {
						    if(regex[1] == '<') {
						      return value < parseInt(regex[2]);
						    } else if(regex[1] == '>') {
						      return value > parseInt(regex[2]);
						    } else if(regex[5] != undefined) {
						      return regex[5] == value;
						    } else {
						      return value >= regex[3]  && value <= regex[4];
						    }
						  } else {
								console.log('invalid regex for chart!!!');
						    return false;
						  }
						},
						calculateMedia: function(data) {
							chart = data;
							chart.media = 0;
							chart.size = 0;
							for(var i = 0; i < data.length; i++ ) {
								chart.media += (data[i].value * data[i].deputies);
								chart.size += data[i].deputies;
							}

							chart.media /= chart.size;
							return data;
						},
						groupData: function(data, ranges, selected, label) {
						  var group = {};
						  var minValues = Object.keys(ranges);
						  var media = Math.floor(this.calculateMedia(data).media);
							var chart = { rose: [], bar: [0, 0, 0], label: label, deputies: 0 };

							for(var k = 0; k < data.length; k++) {
								item = data[k];
						    //Iterate over hash of ranges
						    for(var i = 0 ; i < minValues.length; i++) {
						      var min = minValues[i];
						      if(item.value >= min && item.value <= ranges[min]){
						        if(!group.hasOwnProperty(min)) {
											if(min == ranges[min]) {
												group[min] = { name: min, value: 0, media: false, selected: false };
											} else {
												group[min] = { name: min + '-' + ranges[min], value: 0, media: false, selected: false };
											}
											chart.rose.push(group[min]);
										}

						        //Determine selected group
						        if(selected >= min && selected <= ranges[min])
						          group[min].selected  = true;
						        //Determinate media
						        if(media >= min && media <= ranges[min])
						          group[min].media  = true;
						        group[min].value += item.deputies;
						      }
						    }

								//Less, Equals, More Bar
								if(item.value < selected) {
									chart.bar[0] += item.deputies;
								} else if(item.value == selected) {
									chart.bar[1] += item.deputies;
								} else {
									chart.bar[2] += item.deputies;
								}
								chart.deputies += item.deputies;
						  }

							chart.media = media;
							chart.better = (chart.bar[2] / chart.deputies) * 100;

							console.log(chart);
						  return chart;
						}
          };

	        return Chart;
	    }]);
