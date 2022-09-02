const mongoose = require("mongoose");


const projectSchema = new mongoose.Schema({
    name:{
        required:true,
        type:String,
    },
    description:{
        required:true,
        type:String,
    }
})

module.exports = mongoose.model('Project', projectSchema)