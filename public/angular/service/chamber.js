angular.module('app')
	.factory('Chamber', ['$resource', function($resource) {
	        var Chamber = $resource('chamber/:action', {}, {
						attendance: {
							method: 'GET',
							isArray: true,
							params: {
                action:'attendance'
            	}
						},
						initiatives: {
							method: 'GET',
							isArray: true,
							params: {
                action:'initiatives'
            	}
						},
						votes: {
							method: 'GET',
							isArray: true,
							params: {
                action:'votes'
            	}
						},
						votesAvg: {
							method: 'GET',
							isArray: true,
							params: {
                action:'votes-avg'
            	}
						}
					});

	        return Chamber;
	    }]);
