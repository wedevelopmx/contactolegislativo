var request = require('request');
var async = require('async');
var models = require("../app/models");
var KeyGenerator = require("../jobs/helper/keygenerator");
var HashMap = require("../jobs/helper/hashmap");

var namesKeyGen = new KeyGenerator();
var deputiesHash = new HashMap();

var loadNamesHash  = function(callback) {
  models.Name
    .findAll()
    .then(function(names) {
      for(i in names) {
        //nameHash[names[i].name] = names[i].hash;
        namesKeyGen.loadPair(names[i].value, names[i].key);
      }
      console.log(namesKeyGen.hashRecord.length);
      callback(null, true);
    });
}

var loadDeputies  = function(callback) {
  models.Deputy
    .findAll()
    .then(function(deputies) {
      deputies.forEach(function(item) {
        deputiesHash.put(item.hash, item);
      });
      //console.log(deputiesHash)
      callback(null, true);
    });
}

//These names are wrong on 3x3 portal
var customFilter = function(name) {
  name = name.replace(new RegExp(/"[^"]*"/g),"").trim();
  if(name == 'Lilian') {
    name = 'lillian';
  } else if(name == 'Laura Mitzy') {
    name = 'Laura Mitzi';
  } else if(name == 'Ana Gerorgina') {
    name = 'Ana Georgina';
  } else if(name == 'Padillla') {
    name = 'Padilla';
  } else if(name == 'Diego Valante') {
    name = 'Diego Valente'
  } else if(name == 'Lilia Armindia') {
    name = 'Lilia Arminda'
  } else if(name == 'Arecéli') {
    name = 'Araceli';
  }
  return name;
}

//These names where diferent in 3x3
var changedNames = function(name) {
  if(name == 'Agustín Basave Benítez') {
    name = 'Agustín Francisco de Asís Basave Benítez';
  } else if(name == 'María Victoria Mercado Sánchez') {
    name = 'Ma. Victoria Mercado Sánchez';
  } else if(name == 'Heidi Salazar Espinoza') {
    name = 'Heidi Salazar Espinosa';
  } else if(name == 'Manuel de Jesús Espino Barrientos') {
    name = 'Manuel de Jesús Espino';
  } else if(name == 'Cecilia Romero Castillo') {
    name = 'María Guadalupe Cecilia Romero Castillo';
  }
  return name;
}

var scrape3d3 = function(callback) {
  request('http://3de3.mx/api/apiv1/2015/candidatos/ganadores?cargo=Diputado Federal', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var json = JSON.parse(body);
        var deputies = [];

        json.candidatos.forEach(function(deputy) {
          //if(deputy.activo == 2) {
            var name = customFilter(deputy.nombres) + ' ' + deputy.apellidoPaterno + ' ' + deputy.apellidoMaterno;
            name = changedNames(name);
            var hash = namesKeyGen.generateKeyForTerm(name, ' ');

            if(deputiesHash.containsKey(hash)) {
              var dbDeputy = deputiesHash.get(hash);
              var updatedFields = {};

              if(dbDeputy.twitter == 'NA') {
                updatedFields.twitter = deputy.twitter;
              } else if(dbDeputy.twitter != deputy.twitter) {
                console.log('Diferent ' + dbDeputy.twitter + '  ' + deputy.twitter);
              }

              if(deputy.activo == 2) {
                updatedFields.tres = 1;
                updatedFields.patrimonial = deputy.patrimonial;
                updatedFields.fiscal = deputy.fiscal;
                updatedFields.intereses = deputy.intereses;
              }

              dbDeputy.update(updatedFields);
            } else {
              console.log('Could not find: ' + name);
            }

            deputies.push({
              displayName: name,
              hash: hash,
              genero: deputy.genero,
              twitter: deputy.twitter,
              activo: deputy.activo,
              patrimonial: deputy.patrimonial,
              fiscal: deputy.fiscal,
              intereses: deputy.intereses
            });
          //}
        });

        callback(null, deputies);
      }
  });
}


async.series([loadNamesHash, loadDeputies, scrape3d3], function(err, results) {
  //console.log(results);
  //console.log(results[1].length);
  //console.log(namesKeyGen.hashRecord.length);
});
