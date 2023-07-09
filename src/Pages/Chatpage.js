import React from "react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../Components/ChatPage/SideDrawer";
import { Box } from "@chakra-ui/react";
import MyChats from "../Components/ChatPage/MyChats";
import ChatBox from "../Components/ChatPage/ChatBox";
import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Chatpage() {
  const { user } = ChatState();
  console.log(user);
  const toast = useToast();
  const navigate = useNavigate();

  const checkLogin = async () => {
    try {
      const res = await fetch("https://chat-application-u14e.onrender.com/api/user/checkLogin", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        //credentials: "include",
        withCredentials: true,
      });

      //console.log(data);
      if (res.status === 200) {
        toast({
          title: "Welcome to ChatApp",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Please login to continue",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      throw new Error(error);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <div style={{ width: "100%", padding: "10px" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p={5}
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
}
