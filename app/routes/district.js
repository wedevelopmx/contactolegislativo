var express = require('express');
var router = express.Router();
var models  = require('../models');

router.get('/:id', function(req, res, next) {
  queryString =
  'select d.id, d.displayName, st.name as state, s.area as district, d.picture, d.party, d.curul, d.twitter, s.type as election, count(1) as attn, max(a.attendanceDate) latestAttendance from Seats s left outer join States st on s.StateId = st.id left outer join Deputies d on s.id = d.SeatId left outer join Attendances a on d.id = a.DeputyId where s.id = :districtId and a.id is not null group by  d.id, d.displayName, st.name, s.area, d.picture, d.party, d.curul, d.twitter order by d.id';

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
  'select a.attendance as name, count(1) as value from Attendances a left outer join Deputies de on de.id = a.DeputyId left outer join Seats s on s.id = de.SeatId where s.id = :districtId group by a.attendance';

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
