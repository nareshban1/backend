const projectModel = require("./projects")
const categoryModel = require("./category")
const userModel = require("./users")
const Models ={
    project: projectModel,
    category:categoryModel,
    user:userModel
}

module.exports = Models