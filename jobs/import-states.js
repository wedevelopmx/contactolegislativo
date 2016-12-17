var async = require('async');
var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var models = require("../app/models");

// Source: https://blog.diegovalle.net/2013/02/download-shapefiles-of-mexico.html

models.sequelize.sync().then(function () {

  var importCountry = function(callback) {
    var instream = fs.createReadStream('downloads/diego/data/municipios-inegi.csv');
    var outstream = new stream;
    var rl = readline.createInterface(instream, outstream);

    var towns = [];
    var states = [];
    var statesHash = {};

    rl.on('line', function(line) {
      col = line.split(';');
      if(!isNaN(parseInt(col[0])) && !statesHash.hasOwnProperty(col[1])) {
        states.push({
          id: parseInt(col[0]),
          name: col[1],
          short: col[2]
        });

        statesHash[col[1]] = states[states.length -1];
      }

      if(! isNaN(parseInt(col[3]))) {
        towns.push({
          mid: parseInt(col[3]),
          name: col[4],
          StateId: parseInt(col[0])
        });
      }

    });

    rl.on('close', function() {
      //  console.log(states);
      // console.log(towns);
      models.State
        .bulkCreate(states, { ignoreDuplicates: true})
        .then(function(states) {
          states = states.map(function(state) { return state.get({ plain:true }); })
          console.log(states);
          models.Municipality
          .bulkCreate(towns, { ignoreDuplicates: true})
          .then(function(towns) {
            towns = towns.map(function(town) { return town.get({ plain:true }); })
            console.log(towns);
            callback(null, {
              states: states,
              towns: towns
            });
          });
        });
    });
  }

  async.series([importCountry], function(err, result) {
    // console.log('States: ' + result.states);
    // console.log('Municipalities: ' + result.towns);
  })


});
