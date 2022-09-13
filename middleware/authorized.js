const responseSchema = require("../utils/response");

const getAuth = async (req, res, next) => {
    const {moduleId}=req
    try {
    let token = req.get("authorization");
    if (!token) {
        return res.status(404).json(responseSchema(404, null, "Token not found"));
    }
    token = token.split("")[1];
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    const getModulePermissions = await Models.modules.find({ role_id: req.user.role_id, resource_id: moduleId });
        if (!getModulePermissions) {
            res.status(400).json(responseSchema(400, null, "Module not found"))
            return;
        }
        try {
            var allow = false;
            perms.forEach(function (perm) {
                if (req.method == "POST" && perms.create) allow = true;
                else if (req.method == "GET" && perms.read) allow = true;
                else if (req.method == "PUT" && perms.write) allow = true;
                else if (req.method == "DELETE" && perm.delete) allow = true;

            })
            if (allow) next();
            else {
                res.status(403).send({ error: 'access denied' });
                return res.status(403).json(responseSchema(403, null, "Access Denied"))
            }
        } catch (error) {
            return res.status(400).json(responseSchema(400, null, error.message))
        }
    }
    catch(error){
        return res.status(401).json(responseSchema(401, null, error.message))
    }
}

