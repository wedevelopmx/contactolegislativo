"use strict";

module.exports = function(sequelize, DataTypes) {
  var Name = sequelize.define("Name", {
    name: { type: DataTypes.STRING, name: 'name', unique: true },
    hash: { type: DataTypes.INTEGER, name: 'hash', unique: true }
  }, {
    classMethods: {
      associate: function(models) {

      }
    }
  });

  return Name;
};
