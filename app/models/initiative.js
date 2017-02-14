"use strict";

module.exports = function(sequelize, DataTypes) {
  var Initiative = sequelize.define("Initiative", {
    name: { type: DataTypes.STRING, name: 'name' },
    longName: { type: DataTypes.TEXT('long'), name: 'long_name' },
    sinopsis: { type: DataTypes.STRING, name: 'sinopsis' },
    comision: { type: DataTypes.STRING, name: 'comision' },
    comisionDate: { type: DataTypes.DATE, name: 'comision_date' },
    status: { type: DataTypes.STRING, name: 'curu;' },
    statusDate: { type: DataTypes.DATE, name: 'email' },
    publishedDate: { type: DataTypes.DATE, name: 'birthdate' }
  }, {
    classMethods: {
      associate: function(models) {
        Initiative.belongsTo(models.Session);
        Initiative.belongsToMany(models.Deputy, { through: models.DeputyInitiative });
      }
    },
    indexes: [{
      unique: true,
      fields: ['name', 'SessionId']
    }]
  });

  return Initiative;
};
