const mongoose = require("mongoose")

const connectDB = async() => {
    await mongoose.connect(process.env.DATABASE_URL).then(() => {
        console.log("CONNECTED TO DATABASE SUCCESFULLY")
    }).catch((error) => {
        console.log("ERROR CONNECTING TO DATABASE", error)
    })
}


module.exports = connectDB;