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
    'select value as attendance, count(1) as deputies from ( select DeputyId, attendance, count(attendance)  as value from Attendances where attendance in (:attendance) group by DeputyId ) group by value order by value';
  models.sequelize
  .query(queryString, {
    replacements: { attendance: ['ASISTENCIA', 'OFICIAL COMISIÓN', 'PERMISO MESA DIRECTIVA'] },
    type: models.sequelize.QueryTypes.SELECT
  })
  .then(function(attendance) {
    total = 0;
    attendance.forEach(function(item) { total += item.deputies; })
    result = attendance.map(function(item) {
      item.percentage =  (item.deputies / total) * 100;
      return item;
    });
    res.json(result);
  });

});

router.get('/attendance/pluri', function(req, res, next) {

  queryString =
    'select value as attendance, count(1) as deputies from ( select DeputyId, attendance, count(attendance)  as value from Attendances where attendance in (:attendance) group by DeputyId ) group by value order by value';
  models.sequelize
  .query(queryString, {
    replacements: { attendance: ['ASISTENCIA', 'OFICIAL COMISIÓN', 'PERMISO MESA DIRECTIVA'] },
    type: models.sequelize.QueryTypes.SELECT
  })
  .then(function(attendance) {
    total = 0;
    attendance.forEach(function(item) { total += item.deputies; })
    result = attendance.map(function(item) {
      item.percentage =  (item.deputies / total) * 100;
      return item;
    });
    res.json(result);
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
