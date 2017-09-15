angular.module('app')
	.factory('State', ['$resource', function($resource) {
	        var State = $resource('state/:stateId/:action', {stateId: '@id'}, {
						towns: {
							method: 'GET',
							isArray: true,
							params: {
                action:'towns'
            	}
						}
					});

	        return State;
	    }]);
