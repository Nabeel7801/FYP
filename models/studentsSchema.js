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
    EmergencyContact: { type: String, required: false },
    PresentAddress: { type: String, required: false },
    PermanentAddress: { type: String, required: false },
    DOB: { type: String, required: false },
    Gender: { type: String, required: false },
    CNIC: { type: String, required: false },
    Domicile: { type: String, required: false },
    Nationality: { type: String, required: false },
    Religion: { type: String, required: false },
    BloodGroup: { type: String, required: false },
    FatherName: { type: String, required: false },
    FatherCNIC: { type: String, required: false },
    FatherPhone: { type: String, required: false },
    GuardianName: { type: String, required: false },
    GuardianRelation: { type: String, required: false },
    GuardianCNIC: { type: String, required: false },
    GuardianPhone: { type: String, required: false },
    GuardianOccupation: { type: String, required: false },
    GuardianAddress: { type: String, required: false },
    City: { type: String, required: false },
    PostalCode: { type: String, required: false },
    Department: { type: String, required: false },
    Image: { type: String, required: false },

});

const Students = mongoose.model("students", studentsSchema)

module.exports = Students