const Models = require("../models/models");
const responseSchema = require("../utils/response");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const verifyToken = require("../middleware/verifyToken");
const { ROLES } = require("./roleController");


const UserValidationSchema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
    roles:Joi.array().required()
});


const loginValidationSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required()
});


const registerUserController = async (req, res) => {
    //Checking if user email already exists
   
    const email = await Models.user.findOne({ email: req.body.email });
    if (email) {
        res.status(400).json(responseSchema(400, null, "User Email Already Exists"))
        return;
    }
    //password hashing
    const salt = await bcrypt.genSalt(10);
    console.log(req.body)
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    const user = new Models.user({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        image: req.file?.filename,
        roles:req.body.roles
    });
    try {
    const { error } = await UserValidationSchema.validateAsync(req.body);
    if (error) {
        res.status(400).json(responseSchema(400, null, error.details[0].message));
    }
    const addUser = await user.save();
    res.status(200).json(responseSchema(200, addUser, "Registration Successful"))
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }
}




const loginUserController = async (req, res) => {
    const user = await Models.user.findOne({ email: req.body.email })
    if (!user) return res.status(400).json(responseSchema(400, null, "User Not Found"));

    //check password match
    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) return res.status(400).json(responseSchema(400, null, "User Credentials Incorrect"));

    try {
        const { error } = await loginValidationSchema.validateAsync(req.body);
        if (error) {
            res.status(400).json(responseSchema(400, null, error.details[0].message));
        }
        else {
            let userData = {
                id: user._id,
                name: user.name,
                email: user.email,
                photo: "/public/uploads/" + user.image,
                roles: user.roles
            }
            const token = jwt.sign(userData, process.env.TOKEN_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
            const refreshToken = jwt.sign(userData, process.env.TOKEN_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRATION })

            res.status(200).json(responseSchema(200, { "token": token, "refreshToken": refreshToken }, "Logged in successfully"));
        }
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }
}



const tokenRefreshController = async (req, res) => {
    const { refreshToken, id } = req.body;
    const isValid = verifyToken(id, refreshToken);

    if (!refreshToken) return res.status(400).json(responseSchema(400, null, "Refresh token not found"))
    if (!isValid) return res.status(401).json(responseSchema(400, null, "Invalid Token"))
    const user = await Models.user.findOne({ _id: req.body.id });
    let userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        photo: "/public/uploads/" + user.image,
        roles: user.roles
    }
    const token = jwt.sign(userData, process.env.TOKEN_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
    res.cookie("accessToken", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
      })
    res.status(200).json(responseSchema(200, { "token": token }, "Access token fetched"));
}


const getAllUsers = async (req,res)=>{
    try {
        const data = await Models.user.find();
        res.status(200).json(responseSchema(200, data, "Users Fetched Successfully"))
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }
}

const logout = async (req,res)=>{
    try {
        res.cookie("accessToken", "", { expires: new Date(0) });
        req.logout();
        res.status(200).json(responseSchema(200, null, "Logged Out Successfully"))
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }
 
};

module.exports = {logout,getAllUsers, tokenRefreshController, registerUserController, loginUserController, UserValidationSchema }