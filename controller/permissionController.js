const Models = require("../models/models");
const responseSchema = require("../utils/response");


const getAllPermissions = async (req, res) => {
    try {
        const data = await Models.permission.find();
        res.status(200).json(responseSchema(200, data, "Permissions Fetched Successfully"))
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }
}


const addPermission = async (req, res) => {
    const {
        role_id,
        role_name,
        module_id,
        module_name,
        allowCreate,
        allowUpdate,
        allowRead, 
        allowDelete
    } = req.body
    const data = new Models.permission({
        module_id: module_id,
        module_name: module_name,
        role_id: role_id,
        role_name:role_name,
        create:allowCreate,
        delete: allowDelete,
        read: allowRead,
        update: allowUpdate,
       
    })
    try {
        const saveData = await data.save();
        res.status(200).json(responseSchema(200, saveData, "Permission Saved Successfully"))
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }
}

const updatePermission = async (req, res) => {
    const permissionToUpdate = await Models.permission.findById(req.params.id);
    if (!permissionToUpdate) {
        res.status(400).json(responseSchema(400, null, "Permission not found"))
        return;
    }
    try {
        const {
            role_id,
            role_name,
            module_id,
            module_name,
            allowCreate,
            allowUpdate,
            allowRead, 
            allowDelete
        } = req.body
        const data = {
            module_id: module_id,
            module_name: module_name,
            role_id: role_id,
            role_name:role_name,
            create:allowCreate,
            delete: allowDelete,
            read: allowRead,
            update: allowUpdate,
           
        }
        const updateData = await Models.permission.findByIdAndUpdate(req.params.id, { ...data }, { new: true, runValidators: true })
        console.log(updateData)
        res.status(200).json(responseSchema(200, req.body, "Permission Updated Successfully"))
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }
}

const deletePermission = async (req, res) => {
    const permissionToUpdate = await Models.permission.findById(req.params.id);
    if (!permissionToUpdate) {
        res.status(400).json(responseSchema(400, null, "Permission not found"))
        return;
    }
    try {
        const deleteData = await Models.permission.deleteOne({ _id: req.params.id })
        console.log(deleteData)
        res.status(200).json(responseSchema(200, req.body, "Permission Deleted Successfully"))
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }
}

const getUserPermissions = async (req, res)=>{
    let token = req.get("authorization");
    if (!token) {
        return res.status(404).json(responseSchema(404, null, "Token not found"));
    }
    token = token.split("")[1];
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    console.log(decoded)
    try {
        const permissions = await Models.permission.find({ role_id: req.user.role_id });
        res.status(200).json(responseSchema(200, permissions, "Permission fetched Successfully"))
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }

}





module.exports = {getAllPermissions,deletePermission,updatePermission,addPermission,getUserPermissions}