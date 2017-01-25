angular.module('app')
	.factory('Chart', [function() {
	        var Chart = {
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
						sortAttendanceforRose: function(data, value, label) {
							chart = {
								label: label, rose: [], bar: [0,0,0], media: 0, deputies: 0
							};
							section = 0;
							for(var i = 0; i < data.length; i++ ) {
								//Rose chart
								chart.rose.push({
									value: data[i].deputies,
									name: data[i].value,
									selected: (data[i].value == value)
								});
								//Bar Chart
								if(data[i].value < value) {
									chart.bar[0] += data[i].deputies;
								} else if(data[i].value == value) {
									chart.bar[1] += data[i].deputies;
								} else {
									chart.bar[2] += data[i].deputies;
								}
								chart.deputies += data[i].deputies;
								chart.media += data[i].value;
							}

							chart.media /= data.length;

							chart.rose.forEach(function(item) {
								if(Math.round(chart.media) == item.name ) {
									item.media = true;
								}
							});

							//chart.media = chart.media.toFixed(2);

							chart.better = (chart.bar[2] / chart.deputies) * 100;

							return chart;
						},
						// calculateMedia: function(data) {
						// 	chart = data;
						// 	chart.media = 0;
						// 	for(var i = 0; i < data.length; i++ ) {
						// 		chart.media += data[i].value;
						// 	}
						// 	chart.media /= data.length;
						// 	return data;
						// }
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
						}
          };

	        return Chart;
	    }]);
