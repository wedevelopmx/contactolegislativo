var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');
var iconv  = require('iconv-lite');
var models = require("../app/models");

models.sequelize.sync().then(function () {

  var parseDate = function(stringDate) {
    //We do not make anything for undefined
    if(stringDate != undefined)
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
    var initiatives = { id: index + 1, sessions: [] };
    var options =  {
        encoding: null,
        method: 'GET',
        url: 'http://sitl.diputados.gob.mx/LXIII_leg/iniciativas_diputados_xperiodonplxiii.php?dipt=' + (index + 1)
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
                  init = /(\d*)(.*)\./.exec(text);
                  //init = /(\d*)(.*)\.?/.exec(text);
                  if(init != null) {
                      initiatives[initiatives.length - 1].order = init[1].trim();
                      initiatives[initiatives.length - 1].name = init[2].trim();
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

  // //Reading initiatives from 3 deputy
  // async.times(3, readDeputy , function(err, deputies) {
  //     //Reading initiative details
  //     async.map(deputies, readDeputiesSessions, function(error, result) {
  //       console.log('Finish processing diputados');
  //       //Inserting in database
  //       //TODO: Insering!
  //       //Storing in file for inspection
  //       fs.writeFile('./initiatives.json', JSON.stringify(result) , 'utf-8');
  //     });
  // });

  var sessionsHash = {};

  var save = function(deputies) {
    deputies.forEach(function(deputy) {
      models.Session
        .bulkCreate(deputy.sessions, { ignoreDuplicates: true })
        .then(function(sessions) {
          sessions.forEach(function(session) {
            sessionsHash[sessions.name] = session.get({ plain: true });
          });
          console.log(sessionsHash);
        });
    });
  }

  fs.readFile('./initiatives.json', 'utf8', function (err,data) {
    if (err)
      return console.log(err);
    data = JSON.parse(data);
    save(data);
  });

});
