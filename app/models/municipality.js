"use strict";

module.exports = function(sequelize, DataTypes) {
  var Municipality = sequelize.define("Municipality", {
    mid: { type: DataTypes.INTEGER, name: 'mid' },
    name: { type: DataTypes.STRING, name: 'name' },
    district: { type: DataTypes.INTEGER, name: 'district' },
    multiple: { type: DataTypes.INTEGER, name: 'multiple' }
  }, {
    classMethods: {
      associate: function(models) {
        Municipality.belongsTo(models.State);
        //Municipality.belongsToMany(models.Deputy, { through: models.DeputyMunicipality });
      }
    }
  });

  return Municipality;
};
