var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');
var iconv  = require('iconv-lite');
var models = require("../app/models");
var argv = require("../jobs/helper/arguments");
var google = require('google')

models.sequelize.sync().then(function () {

  var searchDeputy = function(deputy, callback) {
    google.resultsPerPage = 5
    var nextCounter = 0

    google('twitter ' + deputy.displayName, function (err, res){
      if (err) console.error(err)
      stop = false;
      for (var i = 0; i < res.links.length; ++i) {
        var link = res.links[i];
        regex = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/.exec(link.href);
        if(regex[3] == 'twitter.com') {
          console.log(deputy.displayName + " " + regex[3] + " - " + regex[6]);
          deputy.update({ twitter: regex[6] })
          .then(function(){
            callback(null, deputy);
          });
          //Break cycle
          break;
        }

      }
    });
  }

  //Reading arguments from=X to=Y
  var sequence = argv();

  models.Deputy
    .findAll({ where: { id: { $in: sequence.ids } }})
    .then(function(deputies){

      async.map(deputies, searchDeputy, function(err, bulkDiputados) {
          console.log('Times completed!');
      });

    });

  // url = 'https://twitter.com/arlettemunozz?lang=en';
  // regex = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/.exec(url);
  // console.log(regex[3])
  // console.log(regex[6])

});
