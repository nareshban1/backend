const express = require("express");
const connect = require("./database")
const routes = require("./routes/routes")
require("dotenv").config({path:"./.env"})
const bodyParser= require("body-parser")
const path=require("path");
const cors = require("cors");
const app = express();
connect();
app.use(cors({ origin: 'http://localhost:3000', credentials: true, exposedHeaders: ['Set-Cookie', 'Date', 'ETag'] }));
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({limit:"30mb", extended:true}))
// Set EJS as templating engine 
app.set("view engine", "ejs");

app.use("/public", express.static(path.join(__dirname, "public")))

app.use("/api",routes)
//Always on last
app.listen(6969, ()=>{
    console.log("HELLO NARESH ")
})

module.exports=app;

