const router = require("express").Router();
const Chat = require("../models/ChatModel");
const User = require("../models/UserModel");
const Message = require("../models/MessageModel");
const Authenticate = require("../middleware/Authenticate");
const {sendMessage , allMessages} = require("../Controllers/messageControllers");

// route to send a message by taking the logged in user's id , chat id of the selected chat and the message content
router.route("/").post(Authenticate, sendMessage )

// fetching all the messages of a particular chat
router.route("/:chatId").get(Authenticate, allMessages)
module.exports = router;