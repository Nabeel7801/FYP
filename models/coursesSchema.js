const mongoose = require("mongoose");

const coursesSchema = new mongoose.Schema({
    _id: { type: String, required: false },
    CourseCode: { type: String, required: false },
    CourseName: { type: String, required: false },
    CreditHours: { type: String, required: false },
    CourseType: { type: String, required: false },

});

const Course = mongoose.model("courses", coursesSchema)
module.exports = Course