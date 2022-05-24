const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
    _id: { type: String, required: false },
    FacultyName: { type: String, required: false },
    FacultyPhone: { type: String, required: false },
    FacultyEmail: { type: String, required: false },
    CNIC: { type: String, required: false },
    FacultyDepartment: { type: String, required: false },
    FacultyRank: { type: String, required: false },
    DOB: { type: String, required: false },
    Address: { type: String, required: false },
    City: { type: String, required: false },
    State: { type: String, required: false },
    PostalCode: { type: String, required: false },
    UserID: { type: String, required: false}

});

const Faculty = mongoose.model("faculty", facultySchema)

module.exports = Faculty