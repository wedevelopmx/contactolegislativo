var express = require('express');
var router = express.Router();
var models  = require('../models');

router.route('/')
  .get(function(req, res, next) {
    var queryString =
    'select s.id, s.type as election, st.name as state, st.short as short, s.area as district, d.id as deputyId, d.displayName, d.party, d.twitter,  count(1) as attendance from Seats s	join States st on st.id = s.StateId	join Deputies d on s.id = d.SeatId	left outer join Attendances a on d.id = a.Deputyid group by s.id, st.name, s.area, d.id, d.displayName, d.party having count(1) > 1 order by s.type, st.name, s.area  limit :offset, :limit;'

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
    'select attendance as value, count(1) as deputies from ( select s.id, count(1) as attendance from Seats s join Deputies d on s.id = d.SeatId join Attendances a on a.DeputyId = d.id where a.attendance in (:attendance) ';
  if(req.query.party) {
    queryString += ' and d.party = :party';
    replacements.party = req.query.party;
  } else if(req.query.election) {
    queryString += ' and s.type = :election';
    replacements.election = req.query.election;
  }
  queryString += ' group by s.id ) group by attendance';

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

router.get('/initiatives', function(req, res, next) {
  var replacements = { initiativeType: ['Proponente'] };

  var additionalFilter = '';
  if(req.query.party) {
    additionalFilter += ' and d.party = :party';
    replacements.party = req.query.party;
  } else if(req.query.election) {
    additionalFilter += ' and s.type = :election';
    replacements.election = req.query.election;
  }

  var queryString =
    'select initiatives as value, count(1) deputies from ( select s.id, di.type, count(1) as initiatives from Seats s  	join Deputies d on s.id = d.SeatId 	' +
    additionalFilter +
    ' left outer join DeputyInitiatives di on d.id = di.DeputyId and di.type in (:initiativeType) where di.type is not null group by s.id, di.type union select s.id, di.type, 0 as initiatives from Seats s  	join Deputies d on s.id = d.SeatId ' +
    additionalFilter +
    ' left outer join DeputyInitiatives di on d.id = di.DeputyId and di.type in (:initiativeType) where di.type is null group by s.id, di.type having count(1) == 2 order by s.id ) group by initiatives';

  models.sequelize
  .query(queryString, {
    replacements: replacements,
    type: models.sequelize.QueryTypes.SELECT
  })
  .then(function(initiatives) {
    total = 0;
    initiatives.forEach(function(item) { total += item.deputies; })
    result = initiatives.map(function(item) {
      item.percentage =  (item.deputies / total) * 100;
      return item;
    });
    res.json(result);
  });

});

router.get('/votes', function(req, res, next) {
  var replacements = { voteType: ['A favor'] };

  var additionalFilter = '';
  if(req.query.party) {
    additionalFilter += ' and d.party = :party';
    replacements.party = req.query.party;
  } else if(req.query.election) {
    additionalFilter += ' and s.type = :election';
    replacements.election = req.query.election;
  }

  var queryString =
    ' select votes as value, 	count(1) as deputies ' +
    ' from (	select s.id, count(1) as votes 	from Seats s join Deputies d on d.SeatId = s.id join Votes v on v.DeputyId = d.id ' +
    additionalFilter +
    ' where v.vote in (:voteType) group by s.id, v.vote 	order by s.id ) group by value ';

  models.sequelize
  .query(queryString, {
    replacements: replacements,
    type: models.sequelize.QueryTypes.SELECT
  })
  .then(function(votes) {
    total = 0;
    votes.forEach(function(item) { total += item.deputies; })
    result = votes.map(function(item) {
      item.percentage =  (item.deputies / total) * 100;
      return item;
    });
    res.json(result);
  });

});

router.get('/votes-avg', function(req, res, next) {
  var replacements = { };

  var additionalFilter = '';
  if(req.query.party) {
    additionalFilter += ' and d.party = :party';
    replacements.party = req.query.party;
  } else if(req.query.election) {
    additionalFilter += ' and s.type = :election';
    replacements.election = req.query.election;
  }

  var queryString =
    'select vote as value, avg(votes) as avg from ( 	select s.id, v.vote, count(1) as votes 	from Seats s  	join Deputies d on d.SeatId = s.id ' +
    additionalFilter +
    ' join Votes v on v.DeputyId = d.id 	group by s.id, v.vote 	order by s.id ) group by vote ';

  models.sequelize
  .query(queryString, {
    replacements: replacements,
    type: models.sequelize.QueryTypes.SELECT
  })
  .then(function(votes) {
    res.json(votes);
  });

});

module.exports = router;
