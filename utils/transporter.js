const hbs = require('nodemailer-express-handlebars')
var nodemailer = require('nodemailer');
const path = require('path')

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },

});

const handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve('./templates/emailTemplates/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./templates/emailTemplates/'),
};

transporter.use('compile', hbs(handlebarOptions))



module.exports = transporter