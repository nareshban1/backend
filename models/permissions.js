
const mongoose = require("mongoose");
const { role } = require("./models");

const permissionsSchema = new mongoose.Schema({
    module_name: {
        required: true,
        type: String,
    },
    module_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Modules' },
    role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    role_name: { type: String, required: true },
    create: { type: Boolean, required: true },
    delete: { type: Boolean, required: true },
    update: { type: Boolean, required: true },
    read: { type: Boolean, required: true },

})

module.exports = mongoose.model('Permissions', permissionsSchema)