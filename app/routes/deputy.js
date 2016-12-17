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

module.exports = router;
