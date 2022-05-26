const mongoose = require("mongoose");

const studentsSchema = new mongoose.Schema({


    _id: { type: String, required: false },
    UserID: { type: String, required: false},
    Name: { type: String, required: false },
    Institution: { type: String, required: false },
    Career: { type: String, required: false },
    Program: { type: String, required: false },
    Semester: { type: String, required: false },
    Email: { type: String, required: false },
    Phone: { type: String, required: false },
    Department: { type: String, required: false },
    Image: { type: String, required: false },

});

const Students = mongoose.model("students", studentsSchema)

module.exports = Students