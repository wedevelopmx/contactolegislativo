var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');
var iconv  = require('iconv-lite');
var models = require("../app/models");
var argv = require("../jobs/helper/arguments");
var KeyGenerator = require("../jobs/helper/keygenerator");
var HashMap = require("../jobs/helper/hashmap");

models.sequelize.sync().then(function () {

  var namesKeyGen = new KeyGenerator();
  var districtKeyGen = new KeyGenerator();
  var seatHashMap = new HashMap();
  var pluriHashMap = new HashMap();

  var cleanDeputyName = function(name) {
    //Remove unecesary spaces
    name = name.replace(/  +/g, ' ');
    //Remove 'protetesta ..'
    name = name.replace('(no rindieron protesta)', '').trim();
    //remove Licence advice
    name = name.replace('(LICENCIA)','').trim();
    //Remove 'Dip.''
    name = name.substr(name.indexOf('.') + 1, name.lenght).trim();
    return name;
  }

  var identifyParty = function(party) {
    if(party == 'pri01') {
      party = 'pri';
    } else if(party == 'pan') {
      party = 'pan';
    } else if(party == 'logvrd') {
      party = 'pve';
    } else if(party == 'prd01') {
      party = 'prd';
    } else if(party == 'LogoMorena') {
      party = 'morena';
    } else if(party == 'logo_movimiento_ciudadano') {
      party = 'movimiento ciudadano';
    } else if(party == 'panal') {
      party = 'panal';
    } else if(party == 'independiente') {
      party = 'independiente';
    } else if(party == 'encuentro') {
      party = 'encuentro';
    } else if(party == 'logo_SP') {
      party = 'sp';
    }
    return party;
  }

  var readDiputado = function(index, next) {
    var d = {
      id: index
    };

    var seat = {};

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
                  //Seat
                  case 1: param = 'type'; break;
                  case 2: param = 'state'; break;
                  case 3: param = 'area'; break;
                  //Deputy
                  case 4: param = 'curul'; break;
                  case 5: param = 'email'; break;
                  case 6: param = 'birthdate'; break;
                  case 7: param = 'alternate'; break;
                }

                if(index == 1 || index == 2 || index == 3) { // Seat information
                  seat[param] = value;
                } else if(index == 0 || index == 7) { // Deputy information
                  d[param] = cleanDeputyName(value);
                  hash = namesKeyGen.generateKeyForTerm(d[param], ' ');
                  if(index == 0) {
                    d['hash'] = hash;
                  } else {
                    d['altHash'] = hash;
                  }
                } else {
                  d[param] = decodeURIComponent(value);
                }

            });

            $('table tr td img').filter(function(index){
                src = $(this).attr('src');
                switch (index) {
                  case 1:
                    d['picture'] = src;
                    break;
                  case 2:
                    regex = /.*\/(\w+)\..*/.exec(src);
                    d['party'] = identifyParty(regex != null? regex[1]:'Uknown');
                    break;
                }
            });

            console.log('Store: ' + d.id + ' - ' + d.displayName + ' ' + d.hash + ' ' + d.altHash);

            // seat = { type: 'Mayoria Relativa', state: 'NL' , area: '1' , curul: null}
            if(seat.type == 'Mayoría Relativa') {
              d.SeatId = seat.id = districtKeyGen.generateKey(seat.type + '-' + seat.state + '-' + seat.area);
            } else { //Porporcional aka Plurinominal
              if(seatHashMap.containsKey(d.hash)) { //
                console.log('Are we reprocessing deputies?!')
                seat = seatHashMap.get(d.hash);
                d.SeatId = seat.id;
              } else if(seatHashMap.containsKey(d.altHash)) { // We are processing alternate deputy, seat was process before
                console.log('processing alternate');
                seat = seatHashMap.get(d.altHash);
                d.SeatId = seat.id;
              } else { //First time we process this seat
                console.log('First processing')
                plurinominal = 1;
                if(pluriHashMap.containsKey(seat.type + '-' + seat.area)) {
                  plurinominal = pluriHashMap.get(seat.type + '-' + seat.area);
                } else {
                  pluriHashMap.put(seat.type + '-' + seat.area, plurinominal);
                }
                seat.curul = plurinominal;
                d.SeatId = seat.id = districtKeyGen.generateKey(seat.type + '-' + seat.area + '-' + seat.curul);
                seatHashMap.put(d.hash, seat);
                seatHashMap.put(d.altHash, seat);

                //Increment plurinominal count
                pluriHashMap.put(seat.type + '-' + seat.area, plurinominal + 1);
              }
            }

            console.log(' Seat:' + seat.type + '-' + seat.area + '-' + seat.curul);

            next(null, [seat, d]);
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

    var queryString  = 'select s.id, s.type, s.state, s.area, s.curul, d.hash, d.altHash from Seats s join Deputies d on s.id = d.SeatId';
    models.sequelize
    .query(queryString, { type: models.sequelize.QueryTypes.SELECT })
    .then(function(seats) {
      seats.forEach(function(seat) {
        if(seat.type == 'Mayoría Relativa') {
          districtKeyGen.loadPair(seat.state + 'D' + seat.area, seat.id);
        } else {
          districtKeyGen.loadPair(seat.type + '-' + seat.area + '-' + seat.curul, seat.id);
          seatHashMap.put(seat.hash, seat);
          seatHashMap.put(seat.altHash, seat);
          if(pluriHashMap.containsKey(seat.type + '-' + seat.area)) {
            plurinominal = pluriHashMap.get(seat.type + '-' + seat.area);
            pluriHashMap.put(seat.type + '-' + seat.area, plurinominal + 1);
          } else {
            pluriHashMap.put(seat.type + '-' + seat.area, 1);
          }
        }
      });
      callback(null, true);
    });

  }

  var scrapeDeputies = function(callback) {
    //Reading arguments from=X to=Y
    var sequence = argv();
    async.map(sequence.ids, readDiputado, function(err, bulkDiputados) {
    //async.map([847, 848], readDiputado, function(err, bulkDiputados) {
        console.log('Times completed!');
        deputies = [];
        seats = [];
        bulkDiputados.map(function(item) {
          seats.push(item[0]);
          deputies.push(item[1]);
        });
        
        models.Seat
        .bulkCreate(seats, { ignoreDuplicates: true })
        .then(function(seats) {
          models.Deputy
            .bulkCreate(deputies, { ignoreDuplicates: true })
            .then(function(deputies) {
              models.Name
                .bulkCreate(namesKeyGen.hashRecord, { ignoreDuplicates: true })
                .then(function(names) {
                  console.log(seats.length + ' seats have been saved');
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
