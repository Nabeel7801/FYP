const mongoose = require("mongoose");

const degreesSchema = new mongoose.Schema({

    _id: { type: String, required: false },
    DegreeName: { type: String, required: false },
    CreditHours: { type: String, required: false },
    Department: { type: String, required: false },
    Semester: { type: Array, required: false },

});

const Degree = mongoose.model("degrees", degreesSchema)
module.exports = Degree