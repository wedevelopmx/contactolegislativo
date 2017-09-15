"use strict";

module.exports = function(sequelize, DataTypes) {
  var Name = sequelize.define("Name", {
    value: { type: DataTypes.STRING, name: 'value', unique: true },
    key: { type: DataTypes.INTEGER, name: 'key', unique: true }
  }, {
    classMethods: {
      associate: function(models) {

      }
    }
  });

  return Name;
};
