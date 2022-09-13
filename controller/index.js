const project = require("./projectController");
const category = require("./categoryController");
const user = require("./userController");
const role = require("./roleController");
const modules = require("./moduleController");
const permissions = require("./permissionController");
const controller = {
    "project": project,
    "category":category,
    "user":user,
    "role":role,
    "modules":modules,
    "permissions":permissions
}

module.exports = controller