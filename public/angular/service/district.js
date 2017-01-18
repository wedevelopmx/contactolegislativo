angular.module('app')
	.factory('District', ['$resource', function($resource) {
	        var District = $resource('district/:districtId/:action', {districtId: '@id'}, {
						query: { method: 'GET',  isArray:true },
						get: { method: 'GET', isArray: true},
						update: { method: 'PUT'},
						delete: { method: 'DELETE', isArray: true },
						attendance: {
							method: 'GET',
							isArray: true,
							params: {
                action:'attendance',
                districtId: '@id'
            	}
						},
						initiatives: {
							method: 'GET',
							isArray: true,
							params: {
                action:'initiatives',
                districtId: '@id'
            	}
						},
						votes: {
							method: 'GET',
							isArray: true,
							params: {
                action:'votes',
                districtId: '@id'
            	}
						}
					});

	        return District;
	    }]);
