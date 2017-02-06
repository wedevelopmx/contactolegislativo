"use strict";

module.exports = function(sequelize, DataTypes) {
  var Deputy = sequelize.define("Deputy", {
    id: { type: DataTypes.INTEGER, name: 'id', primaryKey: true },
    displayName: { type: DataTypes.STRING, name: 'display_name' },
    curul: { type: DataTypes.STRING, name: 'curu;' },
    email: { type: DataTypes.STRING, name: 'email' },
    birthdate: { type: DataTypes.STRING, name: 'birthdate' },
    picture: { type: DataTypes.STRING, name: 'picture' },
    party: { type: DataTypes.STRING, name: 'party', defaultValue: 'Uknown' },
    alternate: { type: DataTypes.STRING, name: 'alternate' },
    facebook: { type: DataTypes.STRING, name: 'facebook' },
    twitter: { type: DataTypes.STRING, name: 'twitter' },
    phone: { type: DataTypes.STRING, name: 'phone' },
    tres: { type: DataTypes.INTEGER, name: 'tres', defaultValue: 0 },
    fiscal: { type: DataTypes.STRING, name: 'fiscal' },
    intereses: { type: DataTypes.STRING, name: 'intereses' },
    patrimonial: { type: DataTypes.STRING, name: 'patrimonial' },
    hash: { type: DataTypes.INTEGER, name: 'hash', defaultValue: 0 },
    altHash: { type: DataTypes.INTEGER, name: 'alt_hash', defaultValue: 0 }
  }, {
    classMethods: {
      associate: function(models) {
        Deputy.hasMany(models.Attendance, { as: 'attendance'});
        Deputy.belongsToMany(models.Initiative, { through: models.DeputyInitiative });
      }
    }
  });

  return Deputy;
};
