"use strict";

module.exports = function(sequelize, DataTypes) {
  var Vote = sequelize.define("Vote", {
    vote: { type: DataTypes.STRING, vote: 'name' }
  }, {
    classMethods: {
      associate: function(models) {

      }
    }
  });

  return Vote;
};
