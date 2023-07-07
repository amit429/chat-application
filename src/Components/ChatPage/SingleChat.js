import React from "react";
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css"
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "../Others/ProfileModal";
import { ChatState } from "../../Context/ChatProvider";
import { getSender, getSenderFull } from "./ChatLogic";
import ScrollableChat from "./ScrollableChat";

export default function SingleChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();

  const { selectedChat, setSelectedChat, user } = ChatState();

  // fetch messages api call

  const fetchMessages = async () => {

    if (!selectedChat) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/message/${selectedChat._id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      console.log(messages)
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast({
        title: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  //send message api call

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      try {

        const res = await fetch("/api/message/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            chatId: selectedChat._id,
            content: newMessage,
          }),
        });
        setNewMessage("");
        const data = await res.json();
        setMessages([...messages, data]);
        console.log(data);
      } catch (error) {
        console.log(error);
        toast({
          title: "Something went wrong",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const typingHandler = (e) => {

    setNewMessage(e.target.value);
  }

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {/* {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  /> */}
                </>
              ))}
          </Text>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h={{ base: "100%", md: "92%" }}
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "scroll",
                  scrollbarWidth: "none",
                }}
              >
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {/* {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )} */}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
}
