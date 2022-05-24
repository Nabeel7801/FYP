const mongoose = require("mongoose");

const assignedCoursesSchema = new mongoose.Schema({
    _id: { type: String, required: false },
    Department: { type: String, required: false },
    Semester: { type: String, required: false },
    Degree: { type: String, required: false },
    Course: { type: String, required: false },
    Faculty: { type: String, required: false },
    Year: { type: String, required: false },

});

const AssignedCourse = mongoose.model("assignedCourses", assignedCoursesSchema)
module.exports = AssignedCourse