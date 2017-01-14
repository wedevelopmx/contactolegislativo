var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');
var models = require("../app/models");

models.sequelize.sync().then(function () {

  var readAttendance = function(mOffset, next) {
    var files = [];
    var offset = mOffset == 0 ? '' : '/(offset)/' + (mOffset * 10);
    var url = 'http://www5.diputados.gob.mx/index.php/camara/Asistencias-LXIII-Legislatura/Asistencias' + offset;
    request(url, function(error, response, html) {
        if(!error){
            var $ = cheerio.load(html);

            $('.class-file .attribute-file a').filter(function(index){
                //console.log($(this).text() + " - " + $(this).attr('href'));
                files.push({
                  name: $(this).text().trim(),
                  path: $(this).attr('href'),
                  step: 0,
                  type: 'ATTENDANCE'
                });
            });

            next(null, files);
        }
    });
  }

  //Execute elevent times (we validate that pages exist)
  async.times(11, readAttendance , function(err, result) {
      console.log('Times completed!');
      var bulkFiles = [];
      for(i in result) {
        bulkFiles = bulkFiles.concat(result[i]);
      }

      models.DownloadedFile
        .bulkCreate(bulkFiles, { ignoreDuplicates: true })
        .then(function(files) {
          files = files.map(function(file){ return file.get({plain:true}) });
          console.log(files);
        });
  });

});
