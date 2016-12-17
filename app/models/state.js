"use strict";

module.exports = function(sequelize, DataTypes) {
  var State = sequelize.define("State", {
    id: { type: DataTypes.INTEGER, name: 'id', primaryKey: true },
    name: { type: DataTypes.STRING, name: 'name', unique: true },
    short: { type: DataTypes.STRING, name: 'short' }
  }, {
    classMethods: {
      associate: function(models) {
        State.hasMany(models.Municipality, { as: 'municipalities'});
      }
    }
  });

  return State;
};
