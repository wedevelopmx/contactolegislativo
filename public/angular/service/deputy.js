angular.module('app')
	.factory('Deputy', ['$resource', function($resource) {
	        var Deputy = $resource('deputy/:deputyId/:action', {deputyId: '@id'}, {
						query: { method: 'GET',  isArray:true },
						get: { method: 'GET'},
						update: { method: 'PUT'},
						delete: { method: 'DELETE', isArray: true },
						contact: {
							method: 'POST',
							params: {
                action:'contact',
                deputyId: '@id'
            	}
						}
					});

	        return Deputy;
	    }]);
