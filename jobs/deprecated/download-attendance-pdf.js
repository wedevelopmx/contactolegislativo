var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');
var models = require("../app/models");

models.sequelize.sync().then(function () {

  models.DownloadedFile
    .findAll({ where: { step: 0 }, limit: 10}) //Find all scrape files
    .then(function(files) {
      //Download every file
      async.every(files, function(file, callback) {
          request("http://www5.diputados.gob.mx" + file.path)
            .pipe(fs.createWriteStream("./downloads/pdf/" + file.name + ".pdf"))
            .on('finish', function () {
              console.log('File downloaded: ' + file.name);
              file.updateAttributes({ step: 1 });
              callback(null, file.name);
            })
            .on('error', function(error) {
              console.log('Error downloading: ' + file.name);
            });
      }, function(err, result) {
          // if result is true then every file exists
          if(result)
            console.log('Files processed successfully')
      });

    });


});
