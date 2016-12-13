"use strict";

module.exports = function(sequelize, DataTypes) {
  var Diputado = sequelize.define("Diputado", {
    displayName: { type: DataTypes.STRING, name: 'display_name' },
    election: { type: DataTypes.STRING, name: 'election' },
    state: { type: DataTypes.STRING, name: 'state' },
    district: { type: DataTypes.STRING, name: 'district' },
    curul: { type: DataTypes.STRING, name: 'curu;' },
    email: { type: DataTypes.STRING, name: 'email' },
    birthdate: { type: DataTypes.STRING, name: 'birthdate' },
    email: { type: DataTypes.STRING, name: 'email' },
    picture: { type: DataTypes.STRING, name: 'picture' },
    sup: { type: DataTypes.STRING, name: 'sup' },
    hash: { type: DataTypes.INTEGER, name: 'hash', defaultValue: 0 }
  }, {
    classMethods: {
      associate: function(models) {
        models.Diputado.hasMany(models.Attendance, { as: 'attendance'});
      }
    }
  });

  return Diputado;
};
