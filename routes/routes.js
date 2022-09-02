const express = require("express");
const controller = require("../controller");

const routes = express.Router();
//project routes 
routes.get("/projects/all", controller.project.getAllProjects )
routes.post("/projects/add", controller.project.addProject)
routes.put("/projects/update/:id", controller.project.updateProject)
routes.delete("/projects/delete/:id", controller.project.deleteProject)
routes.get("/projects/:id", controller.project.getProjectById)


//user routes
routes.post("/register", controller.user.registerUser )


module.exports = routes