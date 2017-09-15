angular.module('app')
	.factory('Party', ['$resource', function($resource) {
	        var Party = $resource('party/:party/:action', {party: '@party'}, {
						query: { method: 'GET',  isArray:true },
						get: { method: 'GET'},
						update: { method: 'PUT'},
						delete: { method: 'DELETE', isArray: true },
						attendance: {
							method: 'GET',
							isArray: true,
							params: {
                action:'attendance',
                party: '@party'
            	}
						},
						initiatives: {
							method: 'GET',
							isArray: true,
							params: {
                action:'initiatives',
                party: '@party'
            	}
						},
						votes: {
							method: 'GET',
							isArray: true,
							params: {
                action:'votes',
                party: '@party'
            	}
						}
					});

	        return Party;
	    }]);
