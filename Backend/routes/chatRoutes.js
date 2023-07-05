const Chat = require("../models/ChatModel");
const User = require("../models/UserModel");
const router = require("express").Router();
const Authenticate = require("../middleware/Authenticate");
const {
  accessChat,
  getChats,
  createGroup,
  renameGroups,
  removeFromGroup,
  addToGroup,
} = require("../Controllers/chatController");

// accessing all chats
router.route("/allChats").post(Authenticate, accessChat);
router.route("/allChats").get(Authenticate, getChats);

// group
router.route("/group").post(Authenticate, createGroup);
router.route("/rename").put(Authenticate, renameGroups);
router.route("/groupremove").delete(Authenticate, removeFromGroup);
router.route("/groupadd").put(Authenticate, addToGroup);

module.exports = router;
