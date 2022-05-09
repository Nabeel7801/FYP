const mongoose = require("mongoose");

const rolesSchema = new mongoose.Schema({
    _id: { type: String, required: false },
    Role: { type: String, required: false },
    Pages: { type: Array, required: false }
});

const Roles = mongoose.model("roles", rolesSchema)

module.exports = Roles