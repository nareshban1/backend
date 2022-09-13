const Models = require("../models/models");
const responseSchema = require("../utils/response");


const getAllRoles= async (req, res) => {
    try {
        const data = await Models.role.find();
        res.status(200).json(responseSchema(200, data, "Roles Fetched Successfully"))
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }
}


const addRole = async (req, res) => {
    const data = new Models.role({
        name: req.body.name,
    })
    try {
        const saveData = await data.save();
        res.status(200).json(responseSchema(200, saveData, "Role Saved Successfully"))
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }
}

const updateRole = async (req, res) => {
    const roleToUpdate = await Models.role.findById(req.params.id);
    if (!roleToUpdate) {
        res.status(400).json(responseSchema(400, null, "Role not found"))
        return;
    }
    try {
        const updateData = await Models.role.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true, runValidators: true })
        console.log(updateData)
        res.status(200).json(responseSchema(200, req.body, "Role Updated Successfully"))
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }
}

const deleteRole = async (req, res) => {
    const roleToUpdate = await Models.role.findById(req.params.id);
    if (!roleToUpdate) {
        res.status(400).json(responseSchema(400, null, "Role not found"))
        return;
    }
    try {
        const deleteData = await Models.role.deleteOne({ _id: req.params.id })
        console.log(deleteData)
        res.status(200).json(responseSchema(200, req.body, "Role Deleted Successfully"))
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }
}



module.exports = {getAllRoles, deleteRole, addRole, updateRole}