"use strict";

module.exports = function(sequelize, DataTypes) {
  var Decree = sequelize.define("Decree", {
    name: { type: DataTypes.STRING, name: 'name' },
    votationDate: { type: DataTypes.DATE, name: 'votation_date' }
  }, {
    classMethods: {
      associate: function(models) {
        Decree.belongsTo(models.Session);
        Decree.belongsToMany(models.Deputy, { through: models.Vote });
      }
    },
    indexes: [{
      unique: true,
      fields: ['name', 'SessionId']
    }]
  });

  return Decree;
};
