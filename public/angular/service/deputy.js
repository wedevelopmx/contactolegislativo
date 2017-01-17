angular.module('app')
	.factory('Deputy', ['$resource', function($resource) {
	        var Deputy = $resource('deputy/:deputyId/:action', {deputyId: '@id'}, {
						query: { method: 'GET',  isArray:true },
						get: { method: 'GET'},
						update: { method: 'PUT'},
						delete: { method: 'DELETE', isArray: true },
						attendance: {
							method: 'GET',
							isArray: true,
							params: {
                action:'attendance',
                deputyId: '@id'
            	}
						},
						initiatives: {
							method: 'GET',
							isArray: true,
							params: {
                action:'initiatives',
                deputyId: '@id'
            	}
						},
						votes: {
							method: 'GET',
							isArray: true,
							params: {
                action:'votes',
                deputyId: '@id'
            	}
						}
					});

	        return Deputy;
	    }]);