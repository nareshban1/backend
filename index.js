const express = require("express");
const connect = require("./database")
const routes = require("./routes/routes")
require("dotenv").config({path:"./.env"})
const bodyParser= require("body-parser")

const app = express();
connect();
app.use(express.json())
app.use(bodyParser.json({limit:"30mb", extended:true}))


app.use("/api",routes)
//Always on last
app.listen(6969, ()=>{
    console.log("HELLO NARESH ")
})

