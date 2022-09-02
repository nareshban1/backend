const Models = require("../models/models");
const responseSchema = require("../utils/response");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");

const tokenList = {};

const validationSchema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required()
});


const loginValidationSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required()
});


const registerUser = async (req, res) => {
    //Checking if user email already exists


    console.log(req.body)
    const email = await Models.user.findOne({ email: req.body.email });
    if (email) {
        res.status(400).json(responseSchema(400, null, "User Email Already Exists"))
        return;
    }
    //password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const user = new Models.user({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const { error } = await validationSchema.validateAsync(req.body);
        if (error) {
            console.log(error.details[0].message)
            res.status(400).json(responseSchema(400, null, error.details[0].message));
            return;
        }
        else {
            const addUser = await user.save();
            res.status(200).json(responseSchema(200, addUser, "Registration Successful"))
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json(responseSchema(500, null, error.message))
    }

}




const loginUser = async (req, res) => {
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
            const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
            const refreshToken = jwt.sign({ _id: user._id }, config.refreshTokenSecret, { expiresIn: process.env.JWT_REFRESH_EXPIRATION })
            tokenList[refreshToken] = response
            res.status(200).json(responseSchema(200, { "token": token, "refreshToken": refreshToken }, "Logged in successfully"));
        }
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }
}



const tokenRefresh = async (req, res) => {

    const data = req.body

    if (!data.refreshToken) return res.status(400).json(responseSchema(400, null, "Refresh token not found"))

    try {
        if (data.refreshToken && data.refreshToken in tokenList) {
            const user = {

            }
            const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
            const refreshToken = jwt.sign({ _id: user._id }, config.refreshTokenSecret, { expiresIn: process.env.JWT_REFRESH_EXPIRATION })
            tokenList[refreshToken] = response
            res.status(200).json(responseSchema(200, { "token": token, "refreshToken": refreshToken }, "Logged in successfully"));
        }

    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }
}


const user = {
    "registerUser": registerUser,
    "loginUser": loginUser

}

module.exports = user