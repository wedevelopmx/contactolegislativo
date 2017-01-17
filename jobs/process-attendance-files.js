var request = require('request');
var fs = require('fs');
PDFParser = require("pdf2json");
var async = require('async');
var models = require("../app/models");

models.sequelize.sync().then(function () {

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

    var processJSON = function(pdf) {
      date = '';
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

              if(row.length == 3) {
                last = row[row.length-1];
                if(last === 'ASISTENCIA'  || last === 'JUSTIFICADA' ||
                    last === 'INASISTENCIA' || last === 'CÉDULA' ||
                    last === 'OFICIAL COMISIÓN' || last === 'PERMISO MESA DIRECTIVA' ) {
                  attendance.push({
                    name: row[1],
                    hash: hashFullName(row[1]),
                    attendance: row[2],
                    attendanceDate: date
                  });
                }
              } else if(date === '' && row.join(' ').lastIndexOf('2016') >= 0) {
                date = retriveDate(decodeURIComponent(row.join(' ')));
              }

              row = [];
              row.push(decodeURI(text.R[0].T));
          }
          rowY = text.y;
        }
      }

      return attendance;
    }

    var nameHash = {};
    var namesRecords = [];

    var loadNamesHash  = function(callback) {
      models.Name
        .findAll()
        .then(function(names) {
          for(i in names) {
            nameHash[names[i].name] = names[i].hash;
          }
          callback(null, true);
        });
    }

    var hashName = function(name) {
      if(!nameHash.hasOwnProperty(name)) {
        nameHash[name] = Object.keys(nameHash).length + 1;
        namesRecords.push({ name: name, hash: nameHash[name]});
      }

      return nameHash[name];
    }

    var hashFullName = function(fullName) {
      key = 1;
      names = fullName.split(' ');
      for(i in names) {
        key *= hashName(names[i]);
      }
      return key;
    }

    var processFiles = function(callback) {
      models.DownloadedFile
        .findAll({ where: { step: 1 }, limit: 3 }) // Find All downloaded files
        .then(function(files) {
          async.map(files, function(file, callback) {
            //Convert PDF to JSON
            pdfParser = new PDFParser();
            pdfParser.on("pdfParser_dataError", function(errData) {
              console.log('Error');
              console.error(errData.parserError)
            });

            pdfParser.on("pdfParser_dataReady", function(pdf) {
                file.updateAttributes({ step: 2 });
                callback(null, processJSON(pdf));
            });

            pdfParser.loadPDF("./downloads/pdf/" + file.name + ".pdf");

          }, function(err, result) {
              var bulkAttendance = [];
              for(i in result) {
                bulkAttendance = bulkAttendance.concat(result[i]);
              }

              console.log(bulkAttendance);

              models.AttendanceStg
                .bulkCreate(bulkAttendance, { ignoreDuplicates: true })
                .then(function(attendanceStg) {
                  attendanceStg = attendanceStg.map(function(attn) { return attn.get({ plain: true }); })
                  console.log(attendanceStg);
                });

          });
        });
    }

    async.series([loadNamesHash, processFiles], function(err, results) {
      console.log(namesRecords);
    });

});
