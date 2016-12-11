"use strict";

module.exports = function(sequelize, DataTypes) {
  var DownloadedFile = sequelize.define("DownloadedFile", {
    name: { type: DataTypes.STRING, name: 'name', unique: true },
    path: { type: DataTypes.STRING, name: 'path' },
    type: { type: DataTypes.STRING, name: 'type' },
    step: { type: DataTypes.INTEGER, name: 'step' } // 0 - Identified(Scrape), 1 - Downloaded, 2 - Convert, 3 - Imported
  }, {
    classMethods: {
      associate: function(models) {

      }
    }
  });

  return DownloadedFile;
};
