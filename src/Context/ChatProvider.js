import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState();
  const navigate = useNavigate();

  //check if user is logged in from the checkLogin route
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

      const data = await res.json();

      if (!data) {
        navigate("/");
      } else {
        setUser(data);
        console.log(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <ChatContext.Provider
      value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
