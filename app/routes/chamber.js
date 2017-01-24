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

router.route('/')
  .get(function(req, res, next) {
    var queryString =
    'select s.id, st.name as state, st.short as short, s.area as district, d.id as deputyId, d.displayName, d.party, count(1) as attendance from Seats s	join States st on st.id = s.StateId	join Deputies d on s.id = d.SeatId	left outer join Attendances a on d.id = a.Deputyid group by s.id, st.name, s.area, d.id, d.displayName, d.party order by s.id limit :offset, :limit;'

    var offset = req.query.offset == undefined ? 0 : req.query.offset;
    var limit = req.query.limit == undefined ? 25 : req.query.limit;

    models.sequelize
    .query(queryString, {
      replacements: { offset: offset, limit: limit  },
      type: models.sequelize.QueryTypes.SELECT
    })
    .then(function(attendance) {
      res.json(attendance);
    });

  });

router.get('/attendance', function(req, res, next) {
  console.log(req.query);
  var replacements = { attendance: ['ASISTENCIA', 'OFICIAL COMISIÓN', 'PERMISO MESA DIRECTIVA'] };
  var queryString =
    'select number as attendance, count(1) as deputies from ( select s.id, count(1) as number from Seats s join Deputies d on s.id = d.SeatId join Attendances a on a.DeputyId = d.id where a.attendance in (:attendance) ';
  if(req.query.party) {
    queryString += ' and d.party = :party';
    replacements.party = req.query.party;
  } else if(req.query.election) {
    queryString += ' and s.type = :election';
    replacements.election = req.query.election;
  }
  queryString += ' group by s.id ) group by number';

  models.sequelize
  .query(queryString, {
    replacements: replacements,
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

router.get('/:party/attendance', function(req, res, next) {

  queryString =
    'select number as attendance, count(1) as deputies from ( select s.id, count(1) as number from Seats s join Deputies d on s.id = d.SeatId join Attendances a on a.DeputyId = d.id where a.attendance in (:attendance) and d.party = :party group by s.id ) group by number';
  models.sequelize
  .query(queryString, {
    replacements: { attendance: ['ASISTENCIA', 'OFICIAL COMISIÓN', 'PERMISO MESA DIRECTIVA'], party: req.param.party },
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
