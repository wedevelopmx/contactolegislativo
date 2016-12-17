angular.module('app')
  .controller('MainController', ['$scope', '$http', function($scope, $http) {
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
       });
     }, function(response) {
       console.log('There has been an error on geolocation!');
     });
  }]);
