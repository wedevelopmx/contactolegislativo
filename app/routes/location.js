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

  router.route('/:state-:town/byId')
    .get(function(req, res, next) {
      var queryString = 'select s.id as stateId, s.name as state, m.mid as municipalityId, m.name as municipality, m.district, seat.id as seatId from States s left outer join Municipalities m on s.id = m.StateId left outer join Seats seat on seat.StateId = s.id and m.district = seat.area where s.id = :stateId and m.mid = :townId and seat.curul is null';

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

module.exports = router;
