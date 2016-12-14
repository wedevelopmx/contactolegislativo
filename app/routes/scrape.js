var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var router = express.Router();
var models  = require('../models');

var readDiputado = function(index, next) {
  var d = {};
  var url = 'http://sitl.diputados.gob.mx/LXIII_leg/curricula.php?dipt=' + (index + 1);
  request(url, function(error, response, html) {
      if(!error){
          var $ = cheerio.load(html);

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
                case 7: param = 'sup'; break;
              }

              d[param] = $(this).text();

          });

          $('table tr td img').filter(function(index){
              //console.log(index + ' - ' + $(this).attr('src'));
              if(index == 1)
                d['picture'] = $(this).attr('src');

          });

          console.log('push: ' + d.displayName);
          next(null, d);
      }
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {

  // generate 5 users
  async.times(500, readDiputado , function(err, bulkDiputados) {
      console.log('Times completed!');
      models.Deputy
        .bulkCreate(bulkDiputados)
        .then(function(diputados) {
          res.json(diputados);
        });
  });

  console.log('Async created');

});

module.exports = router;
