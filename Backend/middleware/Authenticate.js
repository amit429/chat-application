const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');


const Authenticate = async (req,res,next) => {
    
    try{
        
        const token = req.cookies.token;
        //const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        const verifyToken = jwt.verify(token, "amitpile");
        const rootUser = await User.findOne({_id:verifyToken._id, "tokens.token":token}).select("-password");

        if(!rootUser){
            throw new Error('User not found');
        }

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();


    }
    catch(err){

        res.status(401).send("Unauthorized: No token provided");
        //console.log(err);
    }
}

module.exports = Authenticate;