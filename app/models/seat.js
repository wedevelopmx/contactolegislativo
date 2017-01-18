"use strict";

module.exports = function(sequelize, DataTypes) {
  var Seat = sequelize.define("Seat", {
    id: { type: DataTypes.INTEGER, name: 'id', primaryKey: true },
    type: { type: DataTypes.STRING, name: 'type' },
    state: { type: DataTypes.STRING, name: 'state' },
    area: { type: DataTypes.INTEGER, name: 'area' },
    curul: { type: DataTypes.INTEGER, name: 'curul;' }
  }, {
    classMethods: {
      associate: function(models) {
        Seat.hasMany(models.Deputy, { as: 'deputies'});
      }
    }
  });

  return Seat;
};
