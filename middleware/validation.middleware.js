const { UserValidationSchema } = require("../controller/userController");
const responseSchema = require("../utils/response");

const ValidationMiddleware=(schema)=>{
    return async (req, res, next)=>{
        try{
            console.log(req.body)
            await schema.validateAsync(req.body, {abortEarly:false});
            next();
        }catch(error){
            return res.status(400).json(responseSchema(400, null, error.details.map(detail=>detail.message)));
        }
    }
}

module.exports=ValidationMiddleware