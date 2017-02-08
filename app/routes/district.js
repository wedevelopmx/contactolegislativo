var express = require('express');
var router = express.Router();
var models  = require('../models');

router.get('/:id', function(req, res, next) {
  queryString =
  'select d.id, d.displayName, st.name as state, s.area as district, d.picture, ' +
  'd.party, d.curul, d.facebook, d.twitter, d.email, d.phone, s.type as election, d.tres, d.fiscal, d.patrimonial, d.intereses, ' +
  'count(1) as attn, max(a.attendanceDate) latestAttendance from Seats s left outer join States st on s.StateId = st.id left outer join Deputies d on s.id = d.SeatId left outer join Attendances a on d.id = a.DeputyId where s.id = :districtId and a.id is not null group by  d.id, d.displayName, st.name, s.area, d.picture, d.party, d.curul, d.twitter order by count(1) desc';

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


router.get('/:id/initiatives', function(req, res, next) {
  queryString =
  'select di.type as name, count(1) as value from Seats s join Deputies d on s.id = d.SeatId join DeputyInitiatives di on d.id = di.DeputyId where s.id = :districtId group by s.id, di.type';

  models.sequelize
  .query(queryString, {
    replacements: { districtId: req.params.id },
    type: models.sequelize.QueryTypes.SELECT
  })
  .then(function(attendance) {
    res.json(attendance);
  });
});

router.get('/:id/initiatives-status', function(req, res, next) {
  queryString =
  'select di.type, i.status, count(1) as number from Seats s  	join Deputies d on s.id = d.SeatId 	join DeputyInitiatives di on d.id = di.DeputyId 	join Initiatives i on i.id = di.InitiativeId where s.id = :districtId and i.status is not null group by s.type, d.displayName, di.type, i.status';

  models.sequelize
  .query(queryString, {
    replacements: { districtId: req.params.id },
    type: models.sequelize.QueryTypes.SELECT
  })
  .then(function(attendance) {
    res.json(attendance);
  });
});

router.get('/:id/votes', function(req, res, next) {
  queryString =
  'select v.vote as name, count(1) as value from Seats s join Deputies d on d.SeatId = s.id join Votes v on v.DeputyId = d.id where s.id = :districtId group by v.vote order by count(1) desc';

  models.sequelize
  .query(queryString, {
    replacements: { districtId: req.params.id },
    type: models.sequelize.QueryTypes.SELECT
  })
  .then(function(attendance) {
    res.json(attendance);
  });
});

module.exports = router;
