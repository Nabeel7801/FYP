const mongoose = require("mongoose");

const attendancesSchema = new mongoose.Schema({
    _id: { type: String, required: false },
    Date: { type: String, required: false },
    Status: { type: String, required: false },
    EnrollmentID: { type: String, required: false }

});

const Attendance = mongoose.model("attendances", attendancesSchema)
module.exports = Attendance