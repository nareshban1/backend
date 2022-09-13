const Models = require("../models/models");
const responseSchema = require("../utils/response");


const getAllProjects = async (req, res) => {
    try {
        const data = await Models.project.find();
        res.status(200).json(responseSchema(200, data, "Projects Fetched Successfully"))
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }
}


const addProject = async (req, res) => {
    const data = new Models.project({
        name: req.body.name,
        description: req.body.description,
    })
    try {
        const saveData = await data.save();
        res.status(200).json(responseSchema(200, saveData, "Project Saved Successfully"))
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }
}

const updateProject = async (req, res) => {
    const projectToUpdate = await Models.project.findById(req.params.id);
    if (!projectToUpdate) {
        res.status(400).json(responseSchema(400, null, "Project not found"))
        return;
    }
    try {
        const updateData = await Models.project.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true, runValidators: true })
        console.log(updateData)
        res.status(200).json(responseSchema(200, req.body, "Project Updated Successfully"))
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }
}

const deleteProject = async (req, res) => {
    const projectToUpdate = await Models.project.findById(req.params.id);
    if (!projectToUpdate) {
        res.status(400).json(responseSchema(400, null, "Project not found"))
        return;
    }
    try {
        const deleteData = await Models.project.deleteOne({ _id: req.params.id })
        console.log(deleteData)
        res.status(200).json(responseSchema(200, req.body, "Project Deleted Successfully"))
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }
}


const getProjectById = async (req, res) => {
    try {
        const projectToUpdate = await Models.project.findById(req.params.id);
        res.status(200).json(responseSchema(200, projectToUpdate, "Project Deleted Successfully"))
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }
}


const project = {
    "getAllProjects": getAllProjects,
    "addProject": addProject,
    "updateProject": updateProject,
    "deleteProject": deleteProject,
    "getProjectById":getProjectById
}

module.exports = project