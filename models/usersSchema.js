const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    _id: { type: String, required: false },
    Username: { type: String, required: false },
    Password: { type: String, required: false },
    PhoneNo: { type: String, required: false},
    Name: { type: String, required: false },
    Role: { type: String, required: false },

});

const Users = mongoose.model("users", usersSchema)

module.exports = Users