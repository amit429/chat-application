const Chat = require("../models/ChatModel");
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");

// accessing all chats
const accessChat = asyncHandler(async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    res.status(400);
    throw new Error("User not found");
  }

  var chat = await Chat.find({
    isGroupChat: false,
    $and: [
      //should be equal to the current user or the other user
      { users: { $elemMatch: { $eq: req.userID } } },
      { users: { $elemMatch: { $eq: user_id } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage"); // populating the users array in the chat model with all the user information cause currently we are just having the id of the user

  chat = await User.populate(chat, {
    path: "latestMessage.sender",
    select: "name profilePic email",
  });

  if (chat.length > 0) {
    res.status(200).send(chat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.userID, user_id],
    };

    try {
      const newChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: newChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullChat);
    } catch (err) {
      console.log(err);
    }
  }
});

const getChats = asyncHandler(async (req, res) => {
  try {
    var chats = await Chat.find({
      users: { $elemMatch: { $eq: req.userID } },
    })
      .populate("users", "-password")
      .populate("latestMessage")
      .populate("groupAdmin", "-password")
      .populate("users", "-tokens")
      .populate("groupAdmin", "-tokens")
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name profilePic email",
    });

    res.status(200).send(chats);
  } catch (err) {
    console.log(err);
    throw new Error("Error in getting chats");
  }
});

const createGroup = asyncHandler(async (req, res) => {
  //check if the array of users or name is empty
  const { users, name } = req.body;
  if (!users || !name) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  var usersArray = JSON.parse(users);

  //check if the array of users is empty
  if (usersArray.length < 2) {
    res.status(400);
    throw new Error("Please add more than two users to create a group");
  }

  usersArray.push(req.userID);

  try {
    const newGroup = await Chat.create({
      chatName: name,
      isGroupChat: true,
      users: usersArray,
      groupAdmin: req.userID,
    });

    const fullGroup = await Chat.findOne({ _id: newGroup._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .populate("users", "-tokens")
      .populate("groupAdmin", "-tokens");

    res.status(200).send(fullGroup);
  } catch (err) {
    console.log(err);
    throw new Error("Error in creating group");
  }
});

const renameGroups = asyncHandler(async (req, res) => {
  const { chat_id, name } = req.body;

  const updatedGroup = await Chat.findByIdAndUpdate(
    chat_id,
    {
      chatName: name,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("users", "-tokens")
    .populate("groupAdmin", "-tokens");

  res.status(200).send(updatedGroup);
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chat_id, user_id } = req.body;

  const updatedGroup = await Chat.findByIdAndUpdate(
    chat_id,
    {
      $pull: {
        users: user_id,
      },
    },

    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("users", "-tokens")
    .populate("groupAdmin", "-tokens");

  res.status(200).send(updatedGroup);
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chat_id, user_id } = req.body;

  const updatedGroup = await Chat.findByIdAndUpdate(
    chat_id,
    {
      $push: {
        users: user_id,
      },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("users", "-tokens")
    .populate("groupAdmin", "-tokens");

  if (!updatedGroup) {
    res.status(400);
    throw new Error("Group not found");
  } else {
    res.status(200).send(updatedGroup);
  }
});

module.exports = {
  accessChat,
  getChats,
  createGroup,
  renameGroups,
  removeFromGroup,
  addToGroup,
};
