const multer = require("multer");

var storage = multer.diskStorage({
    destination: function (req, file,cb){
        cb(null,'./public/uploads/')
    },
    filename: function (req,file,cb){
        cb(null, Date.now()+file.originalname)
    }
});


const fileFilter = (req, file,cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png'){
        cb(null,true);
    }
    else{
        cb(null,false);
    }
}


var upload = multer({
    storage:storage,
    fileFilter:fileFilter
})


module.exports = upload