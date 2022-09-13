const mongoose = require("mongoose");

const modulesSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
    },

})

module.exports = mongoose.model('Modules', modulesSchema)