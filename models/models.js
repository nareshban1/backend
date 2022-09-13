const projectModel = require("./projects")
const categoryModel = require("./category")
const userModel = require("./users")
const roleModel = require("./role")
const moduleModel = require("./modules")
const permissionsModel = require("./permissions")
const Models ={
    project: projectModel,
    category:categoryModel,
    user:userModel,
    role:roleModel,
    module:moduleModel,
    permission:permissionsModel
}

module.exports = Models