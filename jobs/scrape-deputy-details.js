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

  var namesKeyGen = new KeyGenerator();
  var deputiesHash = new HashMap();

  var loadNamesHash  = function(callback) {
    models.Name
      .findAll()
      .then(function(names) {
        for(i in names) {
          //nameHash[names[i].name] = names[i].hash;
          namesKeyGen.loadPair(names[i].value, names[i].key);
        }
        console.log('Loaded: ' + namesKeyGen.hashRecord.length);
        callback(null, true);
      });
  }

  var loadDeputies  = function(callback) {
    models.Deputy
      .findAll()
      .then(function(deputies) {
        deputies.forEach(function(item) {
          deputiesHash.put(item.hash, item);
        });
        //console.log(deputiesHash)
        callback(null, true);
      });
  }

  var loadDeputiesDetails = function(callback) {
    var options =  {
        encoding: null,
        method: 'GET',
        url: 'http://sinvotonohaydinero.mx/representantes/'
    }
    request(options, function(error, response, html) {
        if(!error){
            var $ = cheerio.load(iconv.decode(new Buffer(html), 'UTF-8'));

            $('table tr').filter(function(index){
              label =$(this).attr('class');
              if(label != undefined && label.indexOf('row-') != -1) {
                var deputy = {};
                $(this).find('td').filter(function(index) {
                  switch(index) {
                    case 2: //Name
                    name = $(this).text();
                    name = name.replace('(LICENCIA)','').trim();
                    name = name.replace('Guanajuato','').trim();
                    name = name.replace('Puebla','').trim();
                    name = name.replace('A-012','').trim();
                    deputy.name = name;
                    deputy.hash = namesKeyGen.generateKeyForTerm(deputy.name, ' ');
                    break;
                    case 3: //email
                    deputy.email = $(this).text();
                    break;
                    case 4: //twiter
                    deputy.twitter = $(this).text();
                    break;
                    case 5: //Phone
                    deputy.phone = $(this).text();
                    deputies.push(deputy);
                    if(deputiesHash.containsKey(deputy.hash)) {
                      d = deputiesHash.get(deputy.hash);
                      d.update({ facebook: deputy.twitter, phone: deputy.phone, email: deputy.email });
                    } else {
                      console.log('Could not found:');
                      console.log(deputy);
                    }
                    break;
                  }
                });

              }
            });

            callback(null, true);
        }
    });
  }

  async.series([loadNamesHash, loadDeputies, loadDeputiesDetails], function(err, results) {
    console.log(namesKeyGen.hashRecord.length);
    console.log(deputies.length);
    fs.writeFile('./downloads/data/twitter/deputies.json', JSON.stringify(deputies) , 'utf-8');
  });


});
