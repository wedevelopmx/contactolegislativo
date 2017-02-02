var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');
var iconv  = require('iconv-lite');
var models = require("../app/models");
var argv = require("../jobs/helper/arguments");
var google = require('google')
var GoogleSearch = require('google-search');

models.sequelize.sync().then(function () {

  var googleSearch = new GoogleSearch({
    key: 'AIzaSyAKMO6S-DKVLTSIjAZddf-__Pn5WfQfg48',
    cx: '014513992047204772114:xuvoom0s0a0'
  });

  var searchDeputy = function(deputy, callback) {

    googleSearch.build({ //Arlette Ivette Muñoz Cervantes
      q: deputy.displayName + ' twitter',
      num: 5
    }, function(error, response) {
      console.log(response)
      for(var i = 0; response.items != undefined && i < response.items.length; i++) {
        item = response.items[i];
        regex = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/.exec(item.link);
        if(regex[3] == 'twitter.com') {
          console.log(deputy.displayName + " " + regex[3] + " - " + regex[6]);
          deputy.update({ twitter: regex[6] })
          .then(function(){
            callback(null,  {
              id: deputy.id,
              displayName: deputy.displayName,
              twitter: regex[6]
            });
          });
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
          console.log(bulkDiputados);
          fs.writeFile('./downloads/data/twitter/deputies_' + sequence.from + '_' + sequence.to + '.json', JSON.stringify(bulkDiputados) , 'utf-8');
      });

    });

  // url = 'https://twitter.com/arlettemunozz?lang=en';
  // regex = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/.exec(url);
  // console.log(regex[3])
  // console.log(regex[6])

});
