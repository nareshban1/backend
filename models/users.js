const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
    required:true,
    type:String,
    },
    email:{
      required:true,
     type:String,
     unique:true,
    },
    password:{
    type:String ,
     required:true,
     minLength:7,
    },
    date:{
     type:Date,
     default:Date.now(),
    }
    , 
    image:{
     type:String,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
})

module.exports = mongoose.model('User', userSchema)