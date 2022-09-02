const project = require("./projectController");
const category = require("./categoryController");
const user = require("./userController");
const controller = {
    "project": project,
    "category":category,
    "user":user
}

module.exports = controller