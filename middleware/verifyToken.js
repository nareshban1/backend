const jwt = require("jsonwebtoken");
const verifyToken =(userId, token)=>{
    try{
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log(decoded.id, userId)
        return decoded.id === userId;
    }
    catch(error){
        console.log(error)
        return false;
    }
}

module.exports = verifyToken