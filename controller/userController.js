const Models = require("../models/models");
const responseSchema = require("../utils/response");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const decodeToken = require("../middleware/decodeToken");
const { ROLES } = require("./roleController");
const transporter = require("../utils/transporter");
const { use } = require("../utils/transporter");



const UserValidationSchema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
    roles: Joi.array().required()
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
    const username = await Models.user.findOne({ email: req.body.name });
    if (username) {
        res.status(400).json(responseSchema(400, null, "Username Already Exists"))
        return;
    }
    //password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new Models.user({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        image: req.file?.filename,
        roles: req.body.roles ? req.body.roles : []
    });
    try {
        const { error } = await UserValidationSchema.validateAsync(req.body);
        if (error) {
            res.status(400).json(responseSchema(400, null, error.details[0].message));
        }
        const addUser = await user.save();
        const token = jwt.sign({ userId: addUser._id }, process.env.TOKEN_SECRET, { expiresIn: process.env.VERIFY_EMAIL_EXPIRATION });
        let verifyLink = process.env.WEBSITE + "#/verify-email/" + token
        const mailData = {
            from: process.env.EMAIL,
            to: req.body.email,
            subject: 'Verify your email!!',
            template: 'verifyemail',
            context: {
                name: req.body.name,
                verifyLink: verifyLink
            }
        };

        transporter.sendMail(mailData, function (err, info) {
            if (err) {
                console.log(err)
                res.status(500).json(responseSchema(500, null, "Error sending email. Please login to verify email."))
            }
            else
                res.status(200).json(responseSchema(200, addUser, "Registration Successful"))
        });
        // res.status(200).json(responseSchema(200, addUser, "Registration Successful"))
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }
}




const loginUserController = async (req, res) => {
    const user = await Models.user.findOne({ email: req.body.email })
    if (!user) return res.status(400).json(responseSchema(400, null, "User Not Found"));
    if (!user.isActive) return res.status(400).json(responseSchema(400, null, "Verify your email."));

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

const verifyEmail = async (req, res) => {
    const { token } = req.body;
    const decoded = decodeToken(token);
    const user = await Models.user.findOne({ _id: decoded.userId })
    if (!user) return res.status(400).json(responseSchema(400, null, "User Not Found"));
    if (user.isActive) return res.status(400).json(responseSchema(400, null, "User Email Already verified"));

    try {
        const updateData = await Models.user.findByIdAndUpdate(decoded.userId, { isActive: true }, { new: true, runValidators: true })
        res.status(200).json(responseSchema(200, null, "User Email Verified Successfully"))
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }

}

const requestVerification = async (req, res) => {
    const { email } = req.body;
    const user = await Models.user.findOne({ email: email })
    if (!user) return res.status(400).json(responseSchema(400, null, "User with Email Not Found"));
    if (user.isActive) return res.status(400).json(responseSchema(400, null, "User Email Already verified"));

    try {
        const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, { expiresIn: process.env.VERIFY_EMAIL_EXPIRATION });
        let verifyLink = process.env.WEBSITE + "#/verify-email/" + token
        const mailData = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Verify your email!!',
            template: 'verifyemail',
            context: {
                name: user.name,
                verifyLink: verifyLink
            }
        };

        transporter.sendMail(mailData, function (err, info) {
            if (err) {
                console.log(err)
                res.status(500).json(responseSchema(500, null, "Error sending email. Please login to verify email."))
            }
            else
                res.status(200).json(responseSchema(200, user, "Email Verification Link Sent"))
        });
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }

}

const requestPasswordChange = async (req, res) => {
    const { email } = req.body;
    const user = await Models.user.findOne({ email: email })
    if (!user) return res.status(400).json(responseSchema(400, null, "User with Email Not Found"));

    try {
        const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, { expiresIn: process.env.VERIFY_EMAIL_EXPIRATION });
        let verifyLink = process.env.WEBSITE + "#/reset-password/" + token
        const mailData = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Reset Password!!',
            template: 'resetpassword',
            context: {
                name: user.name,
                verifyLink: verifyLink
            }
        };

        transporter.sendMail(mailData, function (err, info) {
            if (err) {
                console.log(err)
                res.status(500).json(responseSchema(500, null, "Error sending email."))
            }
            else
                res.status(200).json(responseSchema(200, user, "Reset Password Link Sent"))
        });
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }
}


const resetPassword = async (req, res) => {
    const { token, password } = req.body;
    const decoded = decodeToken(token);
    const user = await Models.user.findOne({ _id: decoded.userId })
    if (!user) return res.status(400).json(responseSchema(400, null, "User Not Found"));

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const updateData = await Models.user.findByIdAndUpdate(decoded.userId, { password: hashedPassword }, { new: true, runValidators: true })
        res.status(200).json(responseSchema(200, null, "Password changed successfully"))
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
    try {
        const user = await Models.user.findOne({ _id: req.body.id });
        let userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            photo: "/public/uploads/" + user.image,
            roles: user.roles
        }
        const token = jwt.sign(userData, process.env.TOKEN_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
        const newRefreshToken = jwt.sign(userData, process.env.TOKEN_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRATION })
        res.status(200).json(responseSchema(200, { "token": token, "refreshToken": newRefreshToken }, "Token Fetched Successfully"));
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }

}


const getAllUsers = async (req, res) => {
    try {
        const data = await Models.user.find();
        res.status(200).json(responseSchema(200, data, "Users Fetched Successfully"))
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }
}

const logout = async (req, res) => {
    try {
        res.cookie("accessToken", "", { expires: new Date(0) });
        req.logout();
        res.status(200).json(responseSchema(200, null, "Logged Out Successfully"))
    }
    catch (error) {
        res.status(500).json(responseSchema(500, null, error.message))
    }

};

module.exports =
 { 
    resetPassword, 
    requestPasswordChange, 
    logout, 
    getAllUsers, 
    tokenRefreshController, 
    registerUserController, 
    requestVerification, 
    loginUserController, 
    UserValidationSchema, 
    verifyEmail }