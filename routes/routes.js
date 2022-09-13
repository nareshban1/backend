const express = require("express");
const controller = require("../controller");
const { UserValidationSchema } = require("../controller/userController");
const authenticated = require("../middleware/authenticated");
const upload = require("../middleware/imageUpload");
const ValidationMiddleware = require("../middleware/validation.middleware")

const routes = express.Router();
//project routes 
routes.get("/projects/all",  controller.project.getAllProjects)
routes.post("/projects/add", controller.project.addProject)
routes.put("/projects/update/:id", controller.project.updateProject)
routes.delete("/projects/delete/:id", controller.project.deleteProject)
routes.get("/projects/:id", controller.project.getProjectById)


//user routes
routes.post("/register" ,upload.single("image"), controller.user.registerUserController)
routes.post("/login", controller.user.loginUserController)
routes.post("/refresh-token", controller.user.tokenRefreshController)
routes.get("/all-users", controller.user.getAllUsers )
routes.get("/logout", controller.user.logout )

//image upload
module.exports = routes