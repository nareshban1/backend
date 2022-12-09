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
routes.post("/verify-email", controller.user.verifyEmail)
routes.post("/request-verify", controller.user.requestVerification)
routes.post("/request-password-change", controller.user.requestPasswordChange)
routes.post("/reset-password", controller.user.resetPassword)

//roles routes 
routes.get("/roles/all",  controller.role.getAllRoles)
routes.post("/roles/add", controller.role.addRole)
routes.put("/roles/update/:id", controller.role.updateRole)
routes.delete("/roles/delete/:id", controller.role.deleteRole)



//module routes 
routes.get("/module/all",  controller.modules.getAllModules)
routes.post("/module/add", controller.modules.addModules)
routes.put("/module/update/:id", controller.modules.updateModules)
routes.delete("/module/delete/:id", controller.modules.deleteModules)


//Permissions routes 
routes.get("/permissions/all",  controller.permissions.getAllPermissions)
routes.get("/permissions/user",  controller.permissions.getUserPermissions)
routes.post("/permissions/add", controller.permissions.addPermission)
routes.put("/permissions/update/:id", controller.permissions.updatePermission)
routes.delete("/permissions/delete/:id", controller.permissions.deletePermission)
module.exports = routes