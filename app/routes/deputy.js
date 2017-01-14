var express = require('express');
var router = express.Router();
var models  = require('../models');

router.get('/:id', function(req, res, next) {
  models.Deputy
  .findOne({ where : { id: req.params.id } })
  .then(function(deputy) {
    console.log(deputy.get({ plain: true}));
    res.json(deputy);
  });
});

router.get('/:id/attendance', function(req, res, next) {

  models.Attendance
  .findAll({
    attributes: [['attendance', 'name'], [models.Sequelize.fn('count', '1'), 'value']],
    where: { DeputyId: req.params.id },
    group: ['attendance']
  })
  .then(function(attendance) {
    //console.log(attendance.get({plain: true}));
    res.json(attendance);
  });

});

router.get('/:id/initiatives', function(req, res, next) {

  queryString =
  'select  di.type as name, count(1) as value from DeputyInitiatives di join Initiatives i on di.InitiativeId = i.id join Sessions s on s.id = i.SessionId where di.DeputyId = :deputyId group by di.type order by s.name';
  //'select s.id, s.name as periodo, di.type as name, count(1) as value from DeputyInitiatives di join Initiatives i on di.InitiativeId = i.id 	join Sessions s on s.id = i.SessionId where di.DeputyId = :deputyId group by di.type, s.name order by s.id, s.name';
  console.log(models.sequelize.query);
  models.sequelize
  .query(queryString, {
    replacements: { deputyId: req.params.id },
    type: models.sequelize.QueryTypes.SELECT
  })
  .then(function(initiatives) {
    res.json(initiatives)
  });

});

router.get('/:id/votes', function(req, res, next) {

  queryString = 'select s.id, s.name as periodo, di.type as name, count(1) as value from DeputyInitiatives di join Initiatives i on di.InitiativeId = i.id 	join Sessions s on s.id = i.SessionId where di.DeputyId = :deputyId group by di.type, s.name order by s.id, s.name';
  console.log(models.sequelize.query);
  models.sequelize
  .query(queryString, {
    replacements: { deputyId: req.params.id },
    type: models.sequelize.QueryTypes.SELECT
  })
  .then(function(initiatives) {
    res.json(initiatives)
  });

});

module.exports = router;
