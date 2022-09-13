const jwt = require("jsonwebtoken");
const responseSchema = require("../utils/response");

const authenticated = (req, res, next) => {
    try {
        let token = req.get("authorization");

        if (!token) {
            return res.status(404).json(responseSchema(404, null, "Token not found"));
        }

        token = token.split("")[1];
        const decoded = jwt.verify(token,process.env.TOKEN_SECRET)
        req.email= decoded.email;
        next();
    }
    catch(error){
        return res.status(401).json(responseSchema(401, null, error.message))
    }
   

}



module.exports = authenticated