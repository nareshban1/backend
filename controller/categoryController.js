const Models = require("../models/models");
const responseSchema = require("../utils/response");


const getAllCategories = async (req, res) => {
    try {
        const data = await Models.category.find();
        res.status(200).json(responseSchema(200, data, "Categories Fetched Successfully"))
    }
    catch (error) {
        res.status(500).json(responseSchema(500, [], error.message))
    }
}


const addCategory = async (req, res) => {
    const data = new Models.category({
        name: req.body.name,
        description: req.body.description,
    })
    try {
        const saveData = await data.save();
        res.status(200).json(responseSchema(200, saveData, "Category Saved Successfully"))
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }
}

const updateCategory = async (req, res) => {
    const CategoryToUpdate = await Models.category.findById(req.params.id);
    if (!CategoryToUpdate) {
        res.status(400).json(responseSchema(400, null, "Category not found"))
    }
    try {
        const updateData = await Models.category.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true, runValidators: true })
        console.log(updateData)
        res.status(200).json(responseSchema(200, req.body, "Category Updated Successfully"))
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }
}

const deleteCategory = async (req, res) => {
    const CategoryToUpdate = await Models.category.findById(req.params.id);
    if (!CategoryToUpdate) {
        res.status(400).json(responseSchema(400, null, "Category not found"))
    }
    try {
        const deleteData = await Models.category.deleteOne({ _id: req.params.id })
        console.log(deleteData)
        res.status(200).json(responseSchema(200, req.body, "Category Deleted Successfully"))
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }
}





const Category = {
    "getAllCategories": getAllCategories,
    "addCategory": addCategory,
    "updateCategory": updateCategory,
    "deleteCategory": deleteCategory,
}

module.exports = Category