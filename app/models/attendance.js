"use strict";

module.exports = function(sequelize, DataTypes) {
  var Attendance = sequelize.define("Attendance", {
    attendance: { type: DataTypes.STRING, name: 'attendance' },
    description: { type: DataTypes.STRING, name: 'description' },
    attendanceDate: { type: DataTypes.DATE, name: 'attendance_date' },
    stgId: { type: DataTypes.INTEGER, name: 'stgId' }
  }, {
    classMethods: {
      associate: function(models) {
        models.Attendance.belongsTo(models.Deputy);
      }
    }
  });

  return Attendance;
};
