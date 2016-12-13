"use strict";

module.exports = function(sequelize, DataTypes) {
  var AttendanceStg = sequelize.define("AttendanceStg", {
    name: { type: DataTypes.STRING, name: 'name' },
    hash: { type: DataTypes.INTEGER, name: 'hash' },
    attendance: { type: DataTypes.STRING, name: 'attendance' },
    attendanceDate: { type: DataTypes.DATE, name: 'attendance_date' },
    step: { type: DataTypes.INTEGER, name: 'step', defaultValue: 0 } // 0 - Inserted, 1 - processed
  }, {
    classMethods: {
      associate: function(models) {

      }
    }
  });

  return AttendanceStg;
};
