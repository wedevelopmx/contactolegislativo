var async = require('async');
var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var models = require("../app/models");

// Current job process files provided by Diego Valle in his blog
// We use them in order to pull out states, municipalities and districts
// We use this info in order to identify which district user belongs to and which deputy represent him
// Source: https://blog.diegovalle.net/2013/02/download-shapefiles-of-mexico.html

models.sequelize.sync().then(function () {

  var importCountry = function(callback) {
    var instream = fs.createReadStream('downloads/diego/data/municipios-inegi.csv');
    var outstream = new stream;
    var rl = readline.createInterface(instream, outstream);

    var towns = [];
    var states = [];
    var statesHash = {};
    var townsHash = {};

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

        townsHash[col[0] + '-' + col[3]] = towns[towns.length -1];
      }

    });

    rl.on('close', function() {
      async.map(states, importStateDistrict.bind(null, townsHash), function(err, result) {
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
      })
      console.log('Finished!');
    });
  }


  var importStateDistrict = function(townsHash, state, callback) {
    var number = ('0' + state.id);
    var folder = number.substr(number.length-2, 2) + state.name;
    console.log('./downloads/diego/ife/' + folder + '/' +  number.substr(number.length-2, 2) + 'hogar_seccion.txt')
    var instream = fs.createReadStream('./downloads/diego/ife/' + folder + '/' +  number.substr(number.length-2, 2) + 'hogar_seccion.txt');
    var outstream = new stream;
    var rl = readline.createInterface(instream, outstream);

    rl.on('line', function(line) {
      col = line.split(',');
      stateId = col[0];
      district = col[1];
      municipalityId = col[2];
      key = stateId + '-' + municipalityId;
      if(townsHash.hasOwnProperty(key)) {
          townsHash[key].district = parseInt(district);
      } else {
        console.log('  !! Could not find ' + key);
      }

    });

    rl.on('close', function() {
      callback(null, townsHash);
    });
  }

  async.series([importCountry], function(err, result) {
    console.log(result);
    // console.log('States: ' + result.states);
    // console.log('Municipalities: ' + result.towns);
  })


});
