"use strict";

module.exports = function(sequelize, DataTypes) {
  var District = sequelize.define("District", {
    id: { type: DataTypes.INTEGER, name: 'id', primaryKey: true },
    state: { type: DataTypes.STRING, name: 'state' },
    district: { type: DataTypes.STRING, name: 'district' },
  }, {
    classMethods: {
      associate: function(models) {
        //District.hasMany(models.Deputy, { as: 'deputies'});
      }
    }
  });

  return District;
};
