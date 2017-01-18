var express = require('express');
var router = express.Router();
var models  = require('../models');

router.get('/:id', function(req, res, next) {
  queryString =
  'select d.id, d.displayName, di.state, di.district, d.picture, d.party, d.curul, d.twitter, count(1) as attn from Districts di left outer join Deputies d on di.id = d.DistrictId	left outer join Attendances a on d.id = a.DeputyId where di.id = :districtId and d.election = \'Mayoría Relativa\' and a.id is not null group by d.id';

  models.sequelize
  .query(queryString, {
    replacements: { districtId: req.params.id },
    type: models.sequelize.QueryTypes.SELECT
  })
  .then(function(deputies) {
    //console.log(deputies.get({ plain: true}));
    res.json(deputies);
  });
});


router.get('/:id/attendance', function(req, res, next) {
  queryString =
  'select a.attendance as name, count(1) as value from Attendances a left outer join Deputies de on de.id = a.DeputyId 	left outer join Districts d on d.id = de.DistrictId where d.id = :districtId and de.election = \'Mayoría Relativa\' group by a.attendance';

  models.sequelize
  .query(queryString, {
    replacements: { districtId: req.params.id },
    type: models.sequelize.QueryTypes.SELECT
  })
  .then(function(attendance) {
    res.json(attendance);
  });

});

// router.get('/:id/initiatives', function(req, res, next) {
//
  // queryString =
  // 'select  di.type as name, count(1) as value from DeputyInitiatives di join Initiatives i on di.InitiativeId = i.id join Sessions s on s.id = i.SessionId where di.DeputyId = :deputyId group by di.type order by s.name';
  // //'select s.id, s.name as periodo, di.type as name, count(1) as value from DeputyInitiatives di join Initiatives i on di.InitiativeId = i.id 	join Sessions s on s.id = i.SessionId where di.DeputyId = :deputyId group by di.type, s.name order by s.id, s.name';
  // console.log(models.sequelize.query);
  // models.sequelize
  // .query(queryString, {
  //   replacements: { deputyId: req.params.id },
  //   type: models.sequelize.QueryTypes.SELECT
  // })
  // .then(function(initiatives) {
  //   res.json(initiatives)
  // });
//
// });
//
// router.get('/:id/votes', function(req, res, next) {
//
//   queryString = 'select s.id, s.name as periodo, di.type as name, count(1) as value from DeputyInitiatives di join Initiatives i on di.InitiativeId = i.id 	join Sessions s on s.id = i.SessionId where di.DeputyId = :deputyId group by di.type, s.name order by s.id, s.name';
//   console.log(models.sequelize.query);
//   models.sequelize
//   .query(queryString, {
//     replacements: { deputyId: req.params.id },
//     type: models.sequelize.QueryTypes.SELECT
//   })
//   .then(function(initiatives) {
//     res.json(initiatives)
//   });
//
// });

module.exports = router;
