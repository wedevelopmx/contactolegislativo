var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');
var iconv  = require('iconv-lite');
var models = require("../app/models");
var KeyGenerator = require("../jobs/helper/keygenerator");
var HashMap = require("../jobs/helper/hashmap");

models.sequelize.sync().then(function () {
  var deputies = [];

  var loadDeputies  = function(callback) {
    models.Deputy
      .findAll({ where: { facebook: { $ne: null }, twitter: { $eq: null } }, limit: 50 })
      .then(function(result) {
        result.forEach(function(item) {
          deputies.push(item);
        });
        //console.log(deputiesHash)
        callback(null, true);
      });
  }

  var loadDeputiesDetails = function(callback) {
    deputies.forEach(function(deputy) {
      var options =  {
          encoding: null,
          method: 'GET',
          url: deputy.facebook
      }
      request(options, function(error, response, html) {
          if(!error){
            var url = decodeURI(response.toJSON().request.uri.path);
            regex = /%40([^%]*)+%20/.exec(url);
            if(regex != undefined && regex.length > 1) {
              console.log(deputy.displayName + ' - @' + regex[1]);
              deputy.update({ twitter: regex[1] });
            } else {
              console.log(deputy.displayName + ' - NA');
              deputy.update({ twitter: 'NA' });
            }

          }
      });

    });
  }

  async.series([loadDeputies, loadDeputiesDetails], function(err, results) {
    console.log(deputies.length);
    //fs.writeFile('./downloads/data/twitter/deputies.json', JSON.stringify(deputies) , 'utf-8');
  });

});
