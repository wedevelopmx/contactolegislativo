var request = require('request');
var fs = require('fs');
PDFParser = require("pdf2json");
var async = require('async');
var models = require("../app/models");
var KeyGenerator = require("../jobs/helper/keygenerator");

models.sequelize.sync().then(function () {

    var parseFileDate = function(stringDate) {
      if(stringDate.length == 8) { //25022016
        return new Date(stringDate.slice(4,stringDate.length), parseInt(stringDate.slice(2,4)) - 1, stringDate.slice(0,2), 0, 0, 0, 0);
      } else if(stringDate.length == 6) { //250216
        return new Date('20' + stringDate.slice(4,stringDate.length), parseInt(stringDate.slice(2,4)) - 1, stringDate.slice(0,2), 0, 0, 0, 0);
      } else if(stringDate.length == 10) { //25|02|2016
        date = /(\d+)\|+(\w+)\|+(\d+)/.exec(stringDate);
        if(date != undefined) {
          return new Date(date[3], parseInt(date[2]) - 1, date[1], 0, 0, 0, 0);
        }
      }
    }


    var retriveDate = function(stringDate) {
      //Remove dayname and "de"
      stringDate = stringDate.substr(stringDate.indexOf(',') + 1, stringDate.length).replace(/de/g, '').trim().toLocaleLowerCase();
      //Splice
      day = stringDate.slice(0,2);
      month = stringDate.slice(2,stringDate.length - 4).replace(/ +/g, '').slice(0,3);
      year = stringDate.slice(stringDate.length - 4,stringDate.length);
      //Translate month
      month = "enefebmarabrmayjunjulagosepoctnovdic".indexOf(month) / 3 ;
      //console.log(stringDate + " is " + new Date(year, month, day, 0, 0, 0, 0));
      return new Date(year, month, day, 0, 0, 0, 0);
    }

    var processJSON = function(pdf, date) {
      var fileDate = '';
      attendance = [];

      //Iterating Pages
      for(i in pdf.formImage.Pages) {
        page = pdf.formImage.Pages[i];
        row = []; rowY = 0;
        //Iterating Page Content
        for(j in page.Texts) {
          text = page.Texts[j];

          //If text is close to previous, they are in the same row
          if(Math.abs(text.y - rowY) < 0.1){
            row.push(decodeURI(text.R[0].T));
          } else {
              //End of the row
              //console.log(row.length + ' - ' + row.join(''));
              if(row.length == 3) {
                last = row[row.length-1];
                if(last === 'ASISTENCIA'  || last === 'JUSTIFICADA' ||
                    last === 'INASISTENCIA' || last === 'CÉDULA' ||
                    last === 'OFICIAL COMISIÓN' || last === 'PERMISO MESA DIRECTIVA' ) {
                  if(row[1].trim() == 'Etcheverry Aranda Maricela Emilse') {
                    row[1] = 'Azul Etcheverry Aranda'; // Name changes somehow!!!
                  }
                  attendance.push({
                    name: row[1],
                    hash: namesKeyGen.generateKeyForTerm(row[1], ' '),
                    attendance: row[2],
                    attendanceDate: fileDate || date
                  });
                }
              } else if(fileDate === '' && row.join(' ').lastIndexOf('2016') >= 0) {
                fileDate = retriveDate(decodeURIComponent(row.join(' ')));
              }

              row = [];
              row.push(decodeURI(text.R[0].T));
          }
          rowY = text.y;
        }
      }

      return attendance;
    }

    var namesKeyGen = new KeyGenerator();

    var loadNamesHash  = function(callback) {
      models.Name
        .findAll()
        .then(function(names) {
          for(i in names) {
            //nameHash[names[i].name] = names[i].hash;
            namesKeyGen.loadPair(names[i].value, names[i].key);
          }
          callback(null, true);
        });
    }

    var processFiles = function(callback) {
      models.DownloadedFile
        .findAll({ where: { step: 1 }, limit: 10 }) // Find All downloaded files
        .then(function(files) {
          async.map(files, function(file, callback) {
            console.log('opening ' + file.name)
            //Convert PDF to JSON
            pdfParser = new PDFParser();
            pdfParser.on("pdfParser_dataError", function(errData) {
              console.log('Error');
              file.updateAttributes({ step: 999 });
              console.error(errData.parserError)
            });

            pdfParser.on("pdfParser_dataReady", function(pdf) {
                var date = parseFileDate(file.name);
                var json = processJSON(pdf, date);
                //fs.writeFile('./downloads/json/' + file.name + '.json', JSON.stringify(pdf) , 'utf-8');
                console.log('File parsed ' + json.length + ' elements ' + date);
                if(json.length > 0)
                  file.updateAttributes({ step: 2 });
                else
                  file.updateAttributes({ step: 666 });
                callback(null, json);
            });

            pdfParser.loadPDF("./downloads/pdf/" + file.name + ".pdf");

          }, function(err, result) {
              var bulkAttendance = [];
              for(i in result) {
                bulkAttendance = bulkAttendance.concat(result[i]);
              }

              //console.log(bulkAttendance);

              models.AttendanceStg
                .bulkCreate(bulkAttendance, { ignoreDuplicates: true })
                .then(function(attendanceStg) {

                  //Additional names where not being saved
                  models.Name
                    .bulkCreate(namesKeyGen.hashRecord, { ignoreDuplicates: true })
                    .then(function(names) {
                      console.log(names.length + ' names have been saved');
                    });

                  attendanceStg = attendanceStg.map(function(attn) { return attn.get({ plain: true }); })
                  //console.log(attendanceStg);
                });

          });
        });
    }

    async.series([loadNamesHash, processFiles], function(err, results) {
      console.log(namesRecords);
    });

});
