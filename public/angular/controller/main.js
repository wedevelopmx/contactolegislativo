angular.module('app')
  .controller('MainController', ['$scope', '$http', 'State', function($scope, $http, State) {
    $scope.choseLocation = true;

    //Try to find user location
    $http.post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDT1BiMuP2K1Z6l2ZTEwugOMlPAFX_aA_U', {})
     .then(function(response) {
       $http.get('http://nominatim.openstreetmap.org/reverse?format=json&lat=' + response.data.location.lat + '&lon=' + response.data.location.lng + '&zoom=18&addressdetails=1', {})
       .then(function(response) {
         console.log(response.data.address);
         $scope.address = {
           state: response.data.address.state,
           town: response.data.address.county,
           country: response.data.address.country
         };

         if($scope.address.state == 'Ciudad de México')
          $scope.address.state = 'Distrito Federal';

         $http.get('location/' + $scope.address.state + '-' + $scope.address.town, {})
         .then(function(response) {
           console.log(response);
           if(response.data.length > 0) {
             if(response.data[0].multiple < 1) {
               $scope.choseLocation = false;
               $scope.districtUrl = '#/district/' + response.data[0].seatId;   
             } else {
               // TODO: Autoselect 
             }
             
           }
         });
       });
     }, function(response) {
       console.log('There has been an error on geolocation!');
     });

     //Load states list
     State.query({}, function(states) {
       $scope.states = states;
       $scope.selectedState = $scope.states[0];
       $scope.loadMunicipalities();
     });

     //Loading municipalities
     $scope.loadMunicipalities = function() {
       State.towns({ stateId: $scope.selectedState.id }, function(municipalities) {
         $scope.municipalities = municipalities;
         $scope.selectedTown = $scope.municipalities[0];
       })
     }; 
     
     // Load section ranges
     $scope.loadRanges = function() {
       $http.get('location/' + $scope.selectedState.id + '-' + $scope.selectedTown.mid + '/ranges', {})
       .then(function(response) {
         $scope.ranges = response.data;
         $scope.selectedRange = $scope.ranges[0];
         $scope.loadDistrictUrl();
       });
     }
     
     $scope.$watch('selectedTown', function() {
       if(!$scope.selectedTown) return; 
       if($scope.selectedTown.multiple > 0) {
         $scope.loadRanges();
       } else {
         $scope.loadDistrictUrl();
       }
     });

     $scope.loadDistrictUrl = function() {
        var endpoint = `location/${$scope.selectedState.id}/town/${$scope.selectedTown.mid}`;
        if($scope.selectedTown.multiple) {
          endpoint = `location/${$scope.selectedState.id}/range/${$scope.selectedRange.id}`;
        } 
         
        $http.get(endpoint, {})
        .then(function(response) {
          if(response.data.length > 0) {
            $scope.district = response.data[0].district;
            $scope.districtUrl = `#/district/${$scope.id}`;
          }
        });
     }
  }]);
