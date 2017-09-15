var async = require('async');
var models = require("../app/models");

models.sequelize.sync().then(function () {

  var attendanceQuery = "select d.id as DeputyId, a.attendance, a.attendanceDate, a.id as stgId " +
  " from Deputies d join AttendanceStgs a on d.hash = a.hash and a.step = 0" +
  " order by d.id, a.attendanceDate limit 1000";

  var importedAttendanceRecords = "select s.* from AttendanceStgs s join Attendances a on a.stgId = s.id and s.step = 0";

  models.sequelize.query(attendanceQuery)
  .spread(function(attendance, metadata) {

    var importAttendance = function(callback) {
      models.Attendance
        .bulkCreate(attendance)
        .then(function(imported) {
          console.log('imported attendance: ' + imported.length);
          callback();
        });
      //callback();
    }

    var updateStaging = function(callback) {
      models.sequelize.query(importedAttendanceRecords, { model: models.AttendanceStg })
      .then(function(attendance){
        records = attendance.map(function(item) { return item.id });
        console.log(records);
        //async.map(attendance, function(att) { att.updateAttributes({ step: 1 }); })
        models.AttendanceStg.update(
            { step: 1 },
            { where: { id: { $in: records } }}
          );

      })
    }

  async.series([importAttendance, updateStaging], function(err, results) {
        console.log('Job completed');
      });
  })

});
