const mongoose = require("mongoose");

const loginDetailsSchema = new mongoose.Schema({
    _id: { type: String, required: false },
    Username: { type: String, required: false },
    Name: { type: String, required: false },
    Role: {type: String, required: false},
    LoginTime: { type: String, required: false }
});

const LoginDetails = mongoose.model("login_details", loginDetailsSchema)

module.exports = LoginDetails