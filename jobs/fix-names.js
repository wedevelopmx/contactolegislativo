var async = require('async');
var models = require("../app/models");

models.sequelize.sync().then(function () {
  models.AttendanceStg.
    findAll()
    .then(function(attendance) {
      async.map(attendance, function(d) {
        names = d.name.split(" ");
        for(i = 0; i < 2; i++) {
          ln = names.shift();
          names.push(ln);
          if(ln.length <= 3){
            i--;
            console.log('->jump' + ln)
          }

        }
        console.log(" " + names.join(" "));
        d.updateAttributes({ name: names.join(" ")});
      });
    });

});

// select distinct(d.displayName)
// from Diputados d left join AttendanceStgs a on d.displayName = a.name
// where a.name is null
//
// "Sara Paola Galico Félix Díaz"
// "José Luis Orozco Sánchez Aldana"
// "Jesús Juan De La Garza Díaz Del Guante"
// "Francisco José Gutiérrez De Velasco Urtaza"
// "Ma. Marcela González Salas y Petricioli"
//
// "Andrés Fernández del Valle Laisequilla"
//
// "Raúl Domínguez Rex"
//
// "David Ricardo Sánchez Guevara"
// "Remberto Estrada Barba"
// "Quirino Ordaz Coppel"
// "Alberto Silva Ramos"
// "Alfredo Miguel Herrera Deras"
// "Yolanda De la Torre Valdez"
// "María Luisa Gutiérrez Santoyo"
// "Azul Etcheverry Aranda"
// "Jesús Rafael Méndez Salas"
// "Miguel Ángel Yunes Linares"
// "Eduardo Francisco Zenteno Núñez"
// "Manuel Alexander Zetina Aguiluz"
// "Mónica Rodríguez Della Vecchia"
// "Tómas Octaviano Félix"
// "Miriam Tinoco Soto"
// "Manuel de Jesús Espino"
// "Jorge Gaviño Ambriz"
