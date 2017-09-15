var express = require('express');
var router = express.Router();
var models  = require('../models');

router.get('/:id', function(req, res, next) {
  // models.Deputy
  // .findOne({ where : { id: req.params.id } })
  // .then(function(deputy) {
  //   console.log(deputy.get({ plain: true}));
  //   res.json(deputy);
  // });
});

// A = Asistencia por sistema
// AO = Asistencia por Comisión Oficial
// PM = Permiso de Mesa Directiva
// IV = Inasistencia por Votaciones
// AC = Asistencia por cédula
// IJ = Inasistencia justificada
// I = Inasistencia
router.get('/:party/attendance', function(req, res, next) {

  queryString =
    'select value as name, count(1) as value from ( select d.id, d.party, a.attendance, count(1)  as value from Attendances a join Deputies d on a.DeputyId = d.id where a.attendance = :attendance and d.party = :party group by d.id ) group by value';
  models.sequelize
  .query(queryString, {
    replacements: { party: req.params.party, attendance: 'A' },
    type: models.sequelize.QueryTypes.SELECT
  })
  .then(function(attendance) {
    res.json(attendance)
  });

});

module.exports = router;
