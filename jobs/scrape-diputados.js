var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');
var iconv  = require('iconv-lite');
var models = require("../app/models");

models.sequelize.sync().then(function () {

  var readDiputado = function(index, next) {
    var d = {};
    var options =  {
        encoding: null,
        method: 'GET',
        url: 'http://sitl.diputados.gob.mx/LXIII_leg/curricula.php?dipt=' + (index + 1)
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
                  case 7: param = 'sup'; break;
                }

                if(index == 0 || index == 7) {
                  name = $(this).text();
                  //Remove 'protetesta ..'
                  name = name.replace('(no rindieron protesta)', '');
                  //Remove 'Dip.''
                  name = name.substr(name.indexOf('.') + 1, name.lenght).trim();

                  d[param] = name;
                } else {
                  d[param] = decodeURIComponent($(this).text());
                }

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

  // generate 5 users
  async.times(500, readDiputado , function(err, bulkDiputados) {
      console.log('Times completed!');

      models.Diputado
        .bulkCreate(bulkDiputados)
        .then(function(diputados) {
          diputados = diputados.map(function(d) { return d.get({plain:true})});
          console.log(diputados);
        });
  });


});
