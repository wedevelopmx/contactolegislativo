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
    var date = /(\d+)\s+(\w+)\s+(\d+)/.exec(stringDate.toLocaleLowerCase());
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

  var parseAttendance = function(attendance) {

  }

  var readDeputy = function(index, next) {
    var attendance = { id: index, sessions: [] };
    var options =  {
        encoding: null,
        method: 'GET',
        url: 'http://sitl.diputados.gob.mx/LXIII_leg/asistencias_diputados_xperiodonplxiii.php?dipt=' + attendance.id
    }
    request(options, function(error, response, html) {
        if(!error){
            var $ = cheerio.load(iconv.decode(new Buffer(html), 'ISO-8859-1'));

            //$('table table table tbody tr td font strong').filter(function(){
            $('table table a.linkVerde').filter(function(index){
              attendance.
              sessions.push({
                name: $(this).text().trim(),
                url: $(this).attr('href')
              });
            });

            next(null, attendance);
        }
    });
  }

  var readInitiatives = function(deputyId, session, callback) {
    var options =  {
        encoding: null,
        method: 'GET',
        url: 'http://sitl.diputados.gob.mx/LXIII_leg/' + session.url
    }
    request(options, function(error, response, html) {
        if(!error){
            var $ = cheerio.load(iconv.decode(new Buffer(html), 'ISO-8859-1'));
            console.log('Request:' + session.url);
            attendance = [];

            $('table table table table').each(function(index) {
              var date =  '';
              $(this).find('span.TitulosVerde').each(function(index) {
                regex = /([A-Z]+)([0-9]+)/.exec($(this).text());
                date = $(this).text().trim();
              })

              $(this).find('div font').each(function(index) {
                regex = /([0-9]+)([A-Z]+)/.exec($(this).text());
                if(regex != null) {
                  attendance.push({
                    DeputyId: deputyId,
                    attendanceDate: parseDate(regex[1] + ' ' + date),
                    attendance: regex[2]
                  })
                }
              })
            });

            console.log(' #: ' + attendance.length);
            //console.log(attendance);
            session.attendance = attendance;
            callback(null, session);
        }
    });

  }

  var readDeputiesSessions = function(deputy, callback) {
    console.log('Deputy:' + deputy.id);
    async.map(deputy.sessions, readInitiatives.bind(null, deputy.id), function(err, initiatives) {
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
    //Bulk insert initiatives
    models.Attendance
      .bulkCreate(session.attendance, { ignoreDuplicates: true })
      .then(function(attendances) {
        console.log(' Saved ' + attendances.length + ' attendance');
        callback(null, attendances.length);
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
    //console.log(deputies);
      //Reading initiative details
      async.map(deputies, readDeputiesSessions, function(error, deputies) {
        console.log('Finish processing diputados');

        // Inserting in database
        async.series({
          // savedSessions: saveSessions.bind(null, deputies),
          // sessionsHash: hashSessions,
          initiatives: importInitiatives.bind(null, deputies)
        }, function(err, results) {
          console.log(results);
        });

        //Storing in file for inspection
        //fs.writeFile('./downloads/json/initiatives_' + sequence.from + '_' + sequence.to + '.json', JSON.stringify(deputies) , 'utf-8');
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
  //
  // text = '19 Marzo 2016';
  // // init = /(\d*)(.*)[\.|\,|\:]/.exec(text);
  // date = /(\d+)\s+(\w+)\s+(\d+)/.exec(text.toLocaleLowerCase());
  // console.log(date);
});
