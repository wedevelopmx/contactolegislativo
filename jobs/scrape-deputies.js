var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');
var iconv  = require('iconv-lite');
var models = require("../app/models");
var argv = require("../jobs/helper/arguments");

models.sequelize.sync().then(function () {

  var nameHash = {};
  var namesRecords = [];

  var hashName = function(name) {
    if(!nameHash.hasOwnProperty(name)) {
      nameHash[name] = Object.keys(nameHash).length + 1;
      namesRecords.push({ name: name, hash: nameHash[name]});
    }

    return nameHash[name];
  }

  var hashFullName = function(fullName) {
    key = 1;
    names = fullName.split(' ');
    for(i in names) {
      key *= hashName(names[i].trim());
    }
    return key;
  }

  var readDiputado = function(index, next) {
    var d = {
      id: index
    };
    var options =  {
        encoding: null,
        method: 'GET',
        url: 'http://sitl.diputados.gob.mx/LXIII_leg/curricula.php?dipt=' + d.id
    }
    request(options, function(error, response, html) {
        if(!error){
            var $ = cheerio.load(iconv.decode(new Buffer(html), 'ISO-8859-1'));

            //$('table table table tbody tr td font strong').filter(function(){
            $('table table table tbody tr td strong').filter(function(index){
                //console.log(index + ' - ' + $(this).text());
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

                if(index == 0 || index == 7) {
                  name = $(this).text();
                  //Remove 'protetesta ..'
                  name = name.replace('(no rindieron protesta)', '').trim();
                  //
                  name = name.replace('(LICENCIA)','').trim();
                  //Remove 'Dip.''
                  name = name.substr(name.indexOf('.') + 1, name.lenght).trim();

                  d[param] = name;

                  if(index == 0) {
                    d['hash'] = hashFullName(d[param]);
                  }

                } else {
                  d[param] = decodeURIComponent($(this).text());
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

            console.log('Store: ' + d.id + ' - ' + d.displayName);
            next(null, d);
        }
    });
  }

  var loadNamesHash  = function(callback) {
    models.Name
      .findAll()
      .then(function(names) {
        for(i in names) {
          nameHash[names[i].name] = names[i].hash;
        }
        callback(null, true);
      });
  }

  var scrapeDeputies = function(callback) {
    //Reading arguments from=X to=Y
    var sequence = argv();
    async.map(sequence.ids, readDiputado, function(err, bulkDiputados) {
    // // generate 5 users
    // async.times(10, readDiputado , function(err, bulkDiputados) {
        console.log('Times completed!');
        models.Deputy
          .bulkCreate(bulkDiputados, { ignoreDuplicates: true })
          .then(function(diputados) {
            models.Name
              .bulkCreate(namesRecords, { ignoreDuplicates: true })
              .then(function(names) {
                console.log(diputados.length + ' diputados have been saved');
                console.log(names.length + ' names have been saved');
                callback(null, true);
              });
          });
    });

  }

  async.series([loadNamesHash, scrapeDeputies], function(err, results) {
    console.log(results);
  });

});
