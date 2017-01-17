"use strict";

module.exports = function(sequelize, DataTypes) {
  var Deputy = sequelize.define("Deputy", {
    id: { type: DataTypes.INTEGER, name: 'id', primaryKey: true },
    displayName: { type: DataTypes.STRING, name: 'display_name' },
    election: { type: DataTypes.STRING, name: 'election' },
    // state: { type: DataTypes.STRING, name: 'state' },
    // district: { type: DataTypes.STRING, name: 'district' },
    curul: { type: DataTypes.STRING, name: 'curu;' },
    email: { type: DataTypes.STRING, name: 'email' },
    birthdate: { type: DataTypes.STRING, name: 'birthdate' },
    email: { type: DataTypes.STRING, name: 'email' },
    picture: { type: DataTypes.STRING, name: 'picture' },
    party: { type: DataTypes.STRING, name: 'party', defaultValue: 'Uknown' },
    alternate: { type: DataTypes.STRING, name: 'alternate' },
    twitter: { type: DataTypes.STRING, name: 'twitter' },
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
