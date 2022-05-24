const mongoose = require("mongoose");

const enrollmentsSchema = new mongoose.Schema({

    _id: { type: String, required: false },
    AssignedCourse: { type: String, required: false },
    Student: { type: String, required: false }

});

const Enrollment = mongoose.model("enrollments", enrollmentsSchema)
module.exports = Enrollment