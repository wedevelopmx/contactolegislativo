var express = require('express');
var router = express.Router();
var models  = require('../models');

var normalize = function(r) {
  // var r = s.toLowerCase();
  r = r.replace(new RegExp(/[àáâãäå]/g),"a");
  r = r.replace(new RegExp(/[èéêë]/g),"e");
  r = r.replace(new RegExp(/[ìíîï]/g),"i");
  r = r.replace(new RegExp(/[òóôõö]/g),"o");
  r = r.replace(new RegExp(/[ùúûü]/g),"u");
  return r;
}

/* GET home page. */
router.route('/:state-:town')
  .get(function(req, res, next) {
    var queryString = 'select s.id as stateId, s.name as state, m.mid as municipalityId, m.name as municipality, m.district, seat.id as seatId from States s left outer join Municipalities m on s.id = m.StateId left outer join Seats seat on seat.StateId = s.id and m.district = seat.area where s.name = :state and m.name = :municipality and seat.curul is null';

    models.sequelize
    .query(queryString, {
      replacements: { state: normalize(req.params.state), municipality: normalize(req.params.town) },
      type: models.sequelize.QueryTypes.SELECT
    })
    .then(function(state) {
      //console.log(state.get({ plain: true}));
      res.json(state);
    });

  });

  router.route('/:state/town/:town')
    .get(function(req, res, next) {
      var queryString = 'select st.id, st.type, st.state, st.area from States s join Municipalities m on s.id = m.StateId join Seats st on st.state = s.name and st.area = m.district  where s.id = :stateId and m.mid = :townId and curul is null';

      models.sequelize
      .query(queryString, {
        replacements: { stateId: req.params.state, townId: req.params.town },
        type: models.sequelize.QueryTypes.SELECT
      })
      .then(function(state) {
        //console.log(state.get({ plain: true}));
        res.json(state);
      });

    });
    
  router.route('/:state/range/:range')
    .get(function(req, res, next) {
      var queryString = 'select st.id, st.type, st.state, st.area as district from Ranges r join States s on s.id = r.sid join Seats st on st.state = s.name and st.area = r.district where r.sid = :stateId and r.id = :rangeId and st.curul is null';

      models.sequelize
      .query(queryString, {
        replacements: { stateId: req.params.state, rangeId: req.params.range },
        type: models.sequelize.QueryTypes.SELECT
      })
      .then(function(state) {
        //console.log(state.get({ plain: true}));
        res.json(state);
      });

    });
  
    
  router.route('/:state-:town/ranges')
    .get(function(req, res, next) {
      var queryString = 'select r.id, r.district, r.start, r.end, concat(r.start, " - ", r.end) as displayText from Ranges r where r.sid = :stateId and r.mid = :townId';

      models.sequelize
      .query(queryString, {
        replacements: { stateId: req.params.state, townId: req.params.town },
        type: models.sequelize.QueryTypes.SELECT
      })
      .then(function(state) {
        res.json(state);
      });

    });

module.exports = router;
