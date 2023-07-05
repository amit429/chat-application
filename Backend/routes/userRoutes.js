// express router
const router = require('express').Router();
const Chat = require('../models/ChatModel');
const User = require('../models/UserModel');
const Message = require('../models/MessageModel');
const authenticate = require('../middleware/Authenticate');
const {registerUser , authUser , allUsers} = require('../Controllers/userController');


// register user
router.route('/register').post(registerUser);

//login user
router.post('/login', authUser);

//all users
router.get('/allUsers', authenticate, allUsers);

//check if user is logged in
router.get("/checkLogin" , authenticate , (req,res)=>{

    try{
        res.status(200).send(req.rootUser);

    }catch(err){
        console.log(err);
    }

});
// initial route
router.get('/', (req, res) => {
    res.send('Hello World');
});

module.exports = router;