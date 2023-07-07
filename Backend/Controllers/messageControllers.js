const User = require("../models/UserModel");
const Chat = require("../models/ChatModel");
const Message = require("../models/MessageModel");
const asyncHandler = require("express-async-handler");

// route to send a message
const sendMessage = asyncHandler(async (req, res) => {
    const {chatId, content} = req.body;

    if (!chatId || !content) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.userID,
        content: content,
        chat: chatId
    }

    // create a new message
    try {

        // create a new message
        let message = await Message.create(newMessage);

        // add the message to the chat
        message = await message.populate("sender" , "name profilePic");
        message = await message.populate("chat");
        message = await User.populate(message, {path: "chat.users" , select: "name profilePic email"});

        await Chat.findByIdAndUpdate(chatId, {latestMessage: message})
        res.json(message);
        
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});

const allMessages = asyncHandler(async (req, res) => {

    const chatId = req.params.chatId;
    if (!chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    try {
        const messages = await Message.find({chat: chatId}).populate("sender" , "name profilePic").populate("chat");
        res.json(messages);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});

module.exports = {sendMessage , allMessages}