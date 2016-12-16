var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');
var iconv  = require('iconv-lite');
var models = require("../app/models");
var argv = require("../jobs/helper/arguments");

models.sequelize.sync().then(function () {

  var parseDate = function(stringDate) {
    //We do not make anything for undefined
    if(stringDate == undefined)
      return '';
    //Parsing
    var date = /(\d+)-(\w+)-(\d+)/.exec(stringDate);
    if(date != null) {
      year = date[3];
      month = "enefebmarabrmayjunjulagosepoctnovdic".indexOf(date[2].substr(0,3).toLocaleLowerCase()) / 3 ;
      day = date[1];

      return new Date(year, month, day, 0, 0, 0, 0);
    } else {
      console.log(' !Unable to parse date: ' + stringDate);
      return '';
    }
  }

  var readDeputy = function(index, next) {
    var initiatives = { id: index, sessions: [] };
    var options =  {
        encoding: null,
        method: 'GET',
        url: 'http://sitl.diputados.gob.mx/LXIII_leg/iniciativas_diputados_xperiodonplxiii.php?dipt=' + initiatives.id
    }
    request(options, function(error, response, html) {
        if(!error){
            var $ = cheerio.load(iconv.decode(new Buffer(html), 'ISO-8859-1'));

            //$('table table table tbody tr td font strong').filter(function(){
            $('table table a.linkVerde').filter(function(index){
              initiatives.
              sessions.push({
                name: $(this).text(),
                url: $(this).attr('href')
              });;
            });

            next(null, initiatives);
        }
    });
  }

  var readInitiatives = function(session, callback) {

    var options =  {
        encoding: null,
        method: 'GET',
        url: 'http://sitl.diputados.gob.mx/LXIII_leg/' + session.url
    }
    request(options, function(error, response, html) {
        if(!error){
            var $ = cheerio.load(iconv.decode(new Buffer(html), 'ISO-8859-1'));
            console.log('Request:' + session.url);
            initiatives = [];

            $('td.Estilo69').each(function(index){
              text = $(this).text().replace(/\s\s+/g, ' ').trim();
              //Parse all columns
              switch(index % 4) {
                case 0:
                  initiatives.push({});
                  //Intitiative
                  init = /(\d*)(.*)[\.|\,]/.exec(text);
                  //init = /(\d*)(.*)\.?/.exec(text);
                  if(init != null) {
                      initiatives[initiatives.length - 1].order = init[1].trim();
                      initiatives[initiatives.length - 1].name = init[2].trim();
                  } else {
                    console.log(" !!Could not parse: <" + text + ">");
                  }

                  //Relation
                  name = /\.\W?(.*)\:(.*?)\((.*?)\)/.exec(text);
                  if(name != null) {
                      initiatives[initiatives.length - 1].type = name[1].trim();
                      initiatives[initiatives.length - 1].person = name[2].trim();
                      initiatives[initiatives.length - 1].party = name[3];
                  }

                  break;
                case 1:
                  comision = /.*?(\d+-\w+-\d+)(.*)/g.exec(text);
                  if(comision != null) {
                    initiatives[initiatives.length - 1].comisionDate = parseDate(comision[1]);
                    initiatives[initiatives.length - 1].comision = comision[2];
                  } else {
                    console.log(" !Could not parse: <" + text + ">");
                  }
                  break;
                case 2:
                  initiatives[initiatives.length - 1].sinopsis = text;
                  break;
                case 3:
                  tra = /^(\w+)[^-\d]*(\d+-\w+-\d+)?.*?\:?.*?(\d+-\w+-\d+)$/g.exec(text);
                  if(tra != null) {
                      initiatives[initiatives.length - 1].status = tra[1];
                      initiatives[initiatives.length - 1].statusDate = parseDate(tra[2]);
                      initiatives[initiatives.length - 1].publishedDate = parseDate(tra[3]);
                  } else {
                    console.log(" !Could not parse: <" + text + ">");
                  }
                  break;
              }
            });
            console.log(' #: ' + initiatives.length);
            session.initiatives = initiatives;
            callback(null, session);
        }
    });

  }

  var readDeputiesSessions = function(deputy, callback) {
    console.log('Deputy:' + deputy.id);
    async.map(deputy.sessions, readInitiatives, function(err, initiatives) {
      console.log('Finish processing sessions');
      callback(null, deputy);
    });
  }

  // ---------------------------------------------------------------------------------------
  // -------------------------  SAVING DATA REQUESTED --------------------------------------
  // ---------------------------------------------------------------------------------------


  var hashSessions = {};

  var saveSessions = function(deputies, callback) {
    async.map(deputies, function(deputy, callback) {
      callback(null, deputy.sessions);
    }, function(err, sessions) {
      var bulkSessions = [];
      sessions.forEach(function(session) { bulkSessions = bulkSessions.concat(session); })

      models.Session
        .bulkCreate(bulkSessions, { ignoreDuplicates: true })
        .then(function(sessions) {
          callback(null, sessions.length);
        });
    });
  }

  var hashSessions = function(callback) {
    models.Session
      .findAll()
      .then(function(sessions) {
        sessions.forEach(function(session) {
          hashSessions[session.name] = session.get({plain: true});
        });
        callback(null, Object.keys(hashSessions).length);
      });
  }

  var importSessionInitiatives = function(deputyId, session, callback) {
    sessionId = hashSessions[session.name].id;
    initiatives = [];
    rawInitiativesHash = {};

    //Gather all initiatives
    session.initiatives.forEach(function(initiative) {
      //Adding SessionId
      initiative.SessionId = sessionId;
      initiatives.push(initiative);
      //Storing name for DeputyInitiative record
      if(rawInitiativesHash.hasOwnProperty(initiative.name))
        console.log(' !Deputy ' + deputyId + ' already have ' + initiative.name.substr(0, 40) );

      rawInitiativesHash[initiative.name] = initiative;
    });

    console.log('Pair: ' + deputyId + "/" + sessionId +  " with " + initiatives.length + " initiatives ");

    //Bulk insert initiatives
    models.Initiative
      .bulkCreate(initiatives, { ignoreDuplicates: true })
      .then(function(initiatives) {
        console.log(' Searching ' + Object.keys(rawInitiativesHash).length + ' initiatives');
        //console.log(Object.keys(rawInitiativesHash));
        //Reading initiatives to load ID
        models.Initiative
          .findAll({ where: { name: { $in: Object.keys(rawInitiativesHash) }, SessionId: sessionId  }})
          .then(function(initiatives) {
            console.log(' Read ' + initiatives.length + ' initiatives' )

            var deputyInitiatives = [];
            //Generating object deputy initiative
            initiatives.forEach(function(initiative) {
              deputyInitiatives.push({
                DeputyId: deputyId,
                InitiativeId: initiative.id,
                type: rawInitiativesHash[initiative.name].type
              });
            });
            //Inserting deputy initiatives
            models.DeputyInitiative
              .bulkCreate(deputyInitiatives, { ignoreDuplicates: true })
              .then(function(deputyInitiatives) {
                callback(null, deputyInitiatives.length);
              });
          });
      });
  }

  var importDeputyInitiatives = function(deputy, callback) {
    var tasks = [];
    deputy.sessions.forEach(function(session) {
      tasks.push(importSessionInitiatives.bind(null, deputy.id, session));
    });

    async.series(tasks, function(err, result) {
      callback(null, result);
    });
  }

  var importInitiatives = function(deputies, callback) {
    tasks = [];
    deputies.map(function(deputy) {
      tasks.push(importDeputyInitiatives.bind(null, deputy));
    });
    async.series(tasks, function(err, initiatives) {
      callback(err, initiatives);
      console.log('Finished all deputies initiatives');
    });
  }

  var sequence = argv();
  async.map(sequence.ids, readDeputy, function(err, deputies) {
  // //Reading initiatives from 3 deputy
  // async.times(3, readDeputy , function(err, deputies) {
      //Reading initiative details
      async.map(deputies, readDeputiesSessions, function(error, deputies) {
        console.log('Finish processing diputados');
        //Inserting in database
        async.series({
          savedSessions: saveSessions.bind(null, deputies),
          sessionsHash: hashSessions,
          initiatives: importInitiatives.bind(null, deputies)
        }, function(err, results) {
          console.log(results);
        });

        //Storing in file for inspection
        fs.writeFile('./downloads/json/initiatives_' + sequence.from + '_' + sequence.to + '.json', JSON.stringify(deputies) , 'utf-8');
      });
  });

  // fs.readFile('./downloads/json/initiatives.json', 'utf8', function (err,data) {
  //   if (err)
  //     return console.log(err);
  //
  //   deputies = JSON.parse(data);
  //
  //   async.series({
  //     savedSessions: saveSessions.bind(null, deputies),
  //     sessionsHash: hashSessions,
  //     initiatives: importInitiatives.bind(null, deputies)
  //   }, function(err, results) {
  //     console.log(results);
  //   });
  // });

});
