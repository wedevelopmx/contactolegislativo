var express = require('express');
var router = express.Router();
var models  = require('../models');

// router.get('/:id', function(req, res, next) {
//   // models.Deputy
//   // .findOne({ where : { id: req.params.id } })
//   // .then(function(deputy) {
//   //   console.log(deputy.get({ plain: true}));
//   //   res.json(deputy);
//   // });
// });

router.get('/attendance', function(req, res, next) {

  queryString =
    'select value as name, count(1) as value from ( select DeputyId, attendance, count(attendance)  as value from Attendances where attendance in (:attendance) group by DeputyId ) group by value';
  models.sequelize
  .query(queryString, {
    replacements: { attendance: ['ASISTENCIA', 'OFICIAL COMISIÓN', 'PERMISO MESA DIRECTIVA'] },
    type: models.sequelize.QueryTypes.SELECT
  })
  .then(function(attendance) {
    res.json(attendance)
  });

});

// select value as name, count(1) as value
// from (
// select DeputyId, attendance, count(attendance)  as value
// from Attendances
// where attendance = 'ASISTENCIA'
// group by DeputyId)
// group by value

module.exports = router;
