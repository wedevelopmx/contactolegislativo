angular.module('app')
  .controller('DistrictVotesController', ['$scope', 'District', 'Party', 'Chamber', 'Chart',
    function($scope, District, Party, Chamber, Chart) {
    $scope.rating = { full: [1, 1, 1], half: [1], empty: [1]};
    $scope.tweetText = 'Sobre su nivel las iniciativas que ha votado %23representame';

    $scope.$on('district-loaded', function() {

      District.votes({ districtId: $scope.deputyId }, function(votes) {
        grouping = [['A favor'],
                    ['En contra', 'Abstención'],
                    ['Ausente', 'Sólo asistencia']];

        //Attendance Graph
        $scope.votes = votes;
        $scope.votesPie = Chart.sortPie(grouping, votes);
        $scope.deputy.votes = $scope.votesPie[0].total;
        $scope.votesGauge = { deputy: $scope.deputy.votes, partyName: $scope.deputy.party, max: $scope.votesPie.total, resp: 0 };
        //console.log($scope.attendancePie);

        //Generate rate
        $scope.rate = Math.round(($scope.deputy.votes / (2 * $scope.votesPie.total)) * 100); // 2 beacuse we use 5 start not 10
        var generateIcon = function(stars) {
          r = [];
          for(var i = 0; i < stars; i ++){
            r.push(1);
          }
          return r;
        }
        $scope.rating.full = generateIcon(Math.floor($scope.rate / 10));
        $scope.rating.half = generateIcon(Math.floor(($scope.rate % 10) / 5));
        $scope.rating.empty = generateIcon(5 - Math.floor($scope.rate / 10) - Math.floor(($scope.rate % 10) / 5));
        $scope.rate /= 10;

        //Query chamber attendance
        Chamber.votes({}, function(votes) {
          $scope.chamber.votes = votes;

          ranges = { 0: 100, 101: 150, 151: 200, 201: 225, 226: 250, 251: 275, 276: 300 };
          $scope.chamber.votesChart = Chart.groupData(votes, ranges, $scope.deputy.votes, 'Votos');

          $scope.votesGauge.chamber = $scope.chamber.votesChart.media;
          $scope.votesGauge.resp ++;
          //console.log($scope.chamber.votesChart);
        });

        Chamber.votesAvg({}, function(votes) {
          //console.log(votes);
          for(var i = 0; i < votes.length; i++) {
            if(votes[i].value == 'A favor') {
                $scope.votesGauge.chamber = votes[i].avg;
            }
          }
          //console.log($scope.chamber.votesChart);
        });

        //Query chamber party attendance
        Chamber.votesAvg({party: $scope.deputy.party}, function(votes) {
          //console.log(votes);
          for(var i = 0; i < votes.length; i++) {
            if(votes[i].value == 'A favor') {
                $scope.votesGauge.party = votes[i].avg;
            }
          }
          // $scope.chamber.party = { votes : Chart.calculateMedia(votes) } ;
          // $scope.votesGauge.party = $scope.chamber.party.votes.media;
          $scope.votesGauge.resp ++;
          //console.log($scope.chamber.party.votes);
        });

        //Query chamber 'Representación proporcional' aka Plurinominales
        Chamber.votesAvg({election: 'Representación proporcional'}, function(votes) {
          //console.log(votes);
          for(var i = 0; i < votes.length; i++) {
            if(votes[i].value == 'A favor')
              $scope.votesGauge.pluri = votes[i].avg;
          }
          // $scope.chamber.pluri = { votes : Chart.calculateMedia(votes) };
          // $scope.votesGauge.pluri = $scope.chamber.pluri.votes.media;
          $scope.votesGauge.resp ++;
          //console.log($scope.votesGauge);
        });

      });
    });

  }]);
