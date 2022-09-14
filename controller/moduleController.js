const Models = require("../models/models");
const responseSchema = require("../utils/response");


const getAllModules = async (req, res) => {
    try {
        const data = await Models.module.find();
        res.status(200).json(responseSchema(200, data, "Modules Fetched Successfully"))
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }
}


const addModules = async (req, res) => {
    const name = await Models.module.findOne({ name: req.body.name });
    if (name) {
        res.status(400).json(responseSchema(400, null, "Module Already Exists"))
        return;
    }
    const data = new Models.module({
        name: req.body.name,
    })
   
    try {
        const saveData = await data.save();
        res.status(200).json(responseSchema(200, saveData, "Modules Saved Successfully"))
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }
}

const updateModules = async (req, res) => {
    const moduleToUpdate = await Models.module.findById(req.params.id);
    if (!moduleToUpdate) {
        res.status(400).json(responseSchema(400, null, "Modules not found"))
        return;
    }
    try {
        const updateData = await Models.module.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true, runValidators: true })
        console.log(updateData)
        res.status(200).json(responseSchema(200, req.body, "Modules Updated Successfully"))
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }
}

const deleteModules = async (req, res) => {
    const moduleToUpdate = await Models.module.findById(req.params.id);
    if (!moduleToUpdate) {
        res.status(400).json(responseSchema(400, null, "Module not found"))
        return;
    }
    try {
        const deleteData = await Models.module.deleteOne({ _id: req.params.id })
        console.log(deleteData)
        res.status(200).json(responseSchema(200, req.body, "Module Deleted Successfully"))
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }
}






module.exports = {getAllModules,addModules,deleteModules,updateModules}