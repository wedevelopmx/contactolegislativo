var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');
var iconv  = require('iconv-lite');
var models = require("../app/models");
var argv = require("../jobs/helper/arguments");
var KeyGenerator = require("../jobs/helper/keygenerator");

models.sequelize.sync().then(function () {

  var namesKeyGen = new KeyGenerator();
  var districtKeyGen = new KeyGenerator();

  var readDiputado = function(index, next) {
    var d = {
      id: index
    };

    var district = {};

    var options =  {
        encoding: null,
        method: 'GET',
        url: 'http://sitl.diputados.gob.mx/LXIII_leg/curricula.php?dipt=' + d.id
    }
    request(options, function(error, response, html) {
        if(!error){
            var $ = cheerio.load(iconv.decode(new Buffer(html), 'ISO-8859-1'));

            $('table table table tbody tr td strong').filter(function(index){
                //Take value
                value = $(this).text().trim();
                //Evaluate destiny field
                switch (index) {
                  case 0: param = 'displayName'; break;
                  case 1: param = 'election'; break;
                  case 2: param = 'state'; break;
                  case 3: param = 'district'; break;
                  case 4: param = 'curul'; break;
                  case 5: param = 'email'; break;
                  case 6: param = 'birthdate'; break;
                  case 7: param = 'alternate'; break;
                }

                if(index == 2 || index == 3) { // District information
                  district[param] = value;
                  if(index == 3){
                    d['DistrictId'] = district['id'] = districtKeyGen.generateKey(district['state'] + 'D' + district['district']);
                  }

                } else if(index == 0 || index == 7) {
                  //Remove 'protetesta ..'
                  value = value.replace('(no rindieron protesta)', '').trim();
                  //remove Licence advice
                  value = value.replace('(LICENCIA)','').trim();
                  //Remove 'Dip.''
                  value = value.substr(value.indexOf('.') + 1, value.lenght).trim();

                  d[param] = value;

                  if(index == 0) {
                    d['hash'] = namesKeyGen.generateKeyForTerm(d[param], ' ');
                  } else {
                    d['altHash'] = namesKeyGen.generateKeyForTerm(d[param], ' ');
                  }

                } else {
                  d[param] = decodeURIComponent(value);
                }

            });

            $('table tr td img').filter(function(index){
                //console.log(index + ' - ' + $(this).attr('src'));
                if(index == 1)
                  d['picture'] = $(this).attr('src');
                if(index == 2) { //images/pan.png
                  regex = /.*\/(\w+)\..*/.exec($(this).attr('src'));
                  d['party'] = regex != null? regex[1]:'Uknown';
                  if(d['party'] == 'pri01') {
                    d['party'] = 'pri';
                  } else if(d['party'] == 'pan') {
                    d['party'] = 'pan';
                  } else if(d['party'] == 'logvrd') {
                    d['party'] = 'pve';
                  } else if(d['party'] == 'prd01') {
                    d['party'] = 'prd';
                  } else if(d['party'] == 'LogoMorena') {
                    d['party'] = 'morena';
                  } else if(d['party'] == 'logo_movimiento_ciudadano') {
                    d['party'] = 'movimiento ciudadano';
                  } else if(d['party'] == 'panal') {
                    d['party'] = 'panal';
                  } else if(d['party'] == 'independiente') {
                    d['party'] = 'independiente';
                  } else if(d['party'] == 'encuentro') {
                    d['party'] = 'encuentro';
                  } else if(d['party'] == 'logo_SP') {
                    d['party'] = 'sp';
                  }
                }

            });

            console.log('Store: ' + d.id + ' - ' + d.displayName + ' ' + d.hash);
            next(null, [district, d]);
        }
    });
  }

  var loadNamesHash  = function(callback) {
    models.Name
      .findAll()
      .then(function(names) {
        for(i in names) {
          //nameHash[names[i].name] = names[i].hash;
          namesKeyGen.loadPair(names[i].value, names[i].key);
        }
        callback(null, true);
      });
  }

  var loadDistricts = function(callback) {
    models.District
      .findAll()
      .then(function(districts) {
        for(i in districts) {
          districtKeyGen.loadPair(districts[i].state + 'D' + districts[i].district, districts[i].id);
        }
        callback(null, true);
      });
  }

  var scrapeDeputies = function(callback) {
    //Reading arguments from=X to=Y
    var sequence = argv();
    async.map(sequence.ids, readDiputado, function(err, bulkDiputados) {
        console.log('Times completed!');
        deputies = [];
        districts = [];
        bulkDiputados.map(function(item) {
          districts.push(item[0]);
          deputies.push(item[1]);
        });
        models.District
        .bulkCreate(districts, { ignoreDuplicates: true })
        .then(function(districts) {
          models.Deputy
            .bulkCreate(deputies, { ignoreDuplicates: true })
            .then(function(deputies) {
              models.Name
                .bulkCreate(namesKeyGen.hashRecord, { ignoreDuplicates: true })
                .then(function(names) {
                  console.log(districts.length + ' distritos have been saved');
                  console.log(deputies.length + ' diputados have been saved');
                  console.log(names.length + ' names have been saved');
                  callback(null, true);
                });
            });
        });

    });

  }

  async.series([loadNamesHash, loadDistricts, scrapeDeputies], function(err, results) {
    console.log(results);
  });

});
