"use strict";

module.exports = function(sequelize, DataTypes) {
  var DeputyInitiative = sequelize.define("DeputyInitiative", {
    type: { type: DataTypes.STRING, name: 'type' }
  }, {
    classMethods: {
      associate: function(models) {

      }
    }
  });

  return DeputyInitiative;
};
