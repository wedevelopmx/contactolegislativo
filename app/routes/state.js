var express = require('express');
var router = express.Router();
var models  = require('../models');

/* GET home page. */
router.route('/')
  .get(function(req, res, next) {
    models.State
    .findAll()
    .then(function(states) {
      res.json(states);
    });
  });

router.route('/:id')
  .get(function(req, res, next) {
    models.State
    .findAll({ where: { id: req.params.id }, order: [['name', 'DESC']]})
    .then(function(states) {
      res.json(states);
    });
  });

router.route('/:id/towns')
  .get(function(req, res, next) {
    models.Municipality
    .findAll({ where: { StateId: req.params.id }, order: [['name', 'DESC']] })
    .then(function(municipalities) {
      res.json(municipalities);
    })
  });

module.exports = router;
