import React from "react";
import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "../Others/ChatLoading";
import { Spinner } from "@chakra-ui/spinner";
//import NotificationBadge from "react-notification-badge";
//import { Effect } from "react-notification-badge";
//import { getSender } from "../../config/ChatLogics";
import UserListItem from "../Others/UserListItem";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "../Others/ProfileModal";
import { useNavigate } from "react-router-dom";

export default function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const { user ,selectedChat , setSelectedChat , chats , setChats } = ChatState();

  //search users api fetch
  const searchUsers = async () => {
    if (!search)
      return toast({
        title: "Please enter a name to search",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });

    try {
      setLoading(true);
      const res = await fetch(`/api/user/allUsers?name=${search}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      console.log(data);
      setSearchResult(data);
      console.log(searchResult);
      setLoading(false);
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

  // write the logout logic here
    const logout = async () => {

        const res = await fetch("/api/user/logout", {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if(res.status === 200){
            toast({
                title: "Logged out successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            navigate("/");
        }else{
            toast({
                title: "Error whie logging out. Please try again",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }

    //access chat

    const accessChat = async (user_id) => {

        setLoadingChat(true);
        // using the fetch api to access the chat
        const res = await fetch(`/api/chat/allChats`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id }),
        });

        const data = await res.json();
        console.log(data);
        setSelectedChat(data);
        setLoadingChat(false);
        onClose();
    };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="10px 15px 10px 15px"
        borderWidth="5px"
        rounded={5}
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans" mr={5}>
          Inter-React
        </Text>

        <div>
          <Menu>
            <MenuButton
              as={Button}
              bg="white"
              rightIcon={<ChevronDownIcon />}
              _hover={{ bg: "white" }}
            >
              <Avatar
                size="md"
                cursor="pointer"
                name={user.name}
                src={user.profilePic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem
                onClick={logout}
              >Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={searchUsers}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem 
                    key={user._id} 
                    user={user}
                    handleFunction={() => accessChat(user._id)} 
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
