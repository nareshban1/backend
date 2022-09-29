const jwt = require("jsonwebtoken");
const decodeToken =( token)=>{
    try{
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        return decoded
    }
    catch(error){
        console.log(error)
        return {};
    }
}

module.exports = decodeToken