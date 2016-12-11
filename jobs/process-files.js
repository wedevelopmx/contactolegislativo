var request = require('request');
var fs = require('fs');
PDFParser = require("pdf2json");
var async = require('async');
var models = require("../app/models");

models.sequelize.sync().then(function () {

    models.DownloadedFile
      .findAll({ where: { step: 1 } }) // Find All downloaded files
      .then(function(files) {
        async.every(files, function(file, callback) {
          //Convert PDF to JSON
          pdfParser = new PDFParser();
          pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
          pdfParser.on("pdfParser_dataReady", pdfData => {
              //fs.writeFile(__dirname + "/result.json", JSON.stringify(pdfData));
          });

          pdfParser.loadPDF(__dirname  + "/mypdf.pdf");
        }, function(err, result) {
            // if result is true then every file exists
            console.log(result);
        });
      });

});
