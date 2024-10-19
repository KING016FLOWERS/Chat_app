"use client";

import { useSession } from "next-auth/react";
import { use, useEffect, useState } from "react";
import ChatBox from "./ChatBox";
import Loader from "./Loader";
import { pusherClient } from "@lib/pusher";

const ChatList = ({ currentChatId }) => {
  const { data: sessions } = useSession();
  const currentUser = sessions?.user;

  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");

  const getChats = async () => {
    try {
      const res = await fetch(
        search !== ""
          ? `/api/users/${currentUser._id}/searchChat/${search}`
          : `/api/users/${currentUser._id}`
      );
      const data = await res.json();
      setChats(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      getChats();
    }
  }, [currentUser, search]);

  useEffect(() => {
    if (currentUser) {
      pusherClient.subscribe(currentUser._id);

      const handleChatUpdate = (updatedChat) => {
        setChats((allChats) =>
          allChats.map((chat) => {
            if (chat._id === updatedChat.id) {
              return { ...chat, messages: updatedChat.messages };
            } else {
              return chat;
            }
          })
        );
      };

      const handleNewChat = (newChat) => {
        setChats((allChats) => [...allChats, newChat]);
      }

      pusherClient.bind("update-chat", handleChatUpdate);
      pusherClient.bind("new-chat", handleNewChat);

      return () => {
        pusherClient.unsubscribe(currentUser._id);
        pusherClient.unbind("update-chat", handleChatUpdate);
        pusherClient.unbind("new-chat", handleNewChat);
      };
    }
  }, [currentUser]);

  return loading ? (
    <Loader />
  ) : (
    <div className="chat-list">
     <input
  placeholder="Search chat..."
  className="input-search"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    border: '2px solid gray', // Green border
    borderRadius: '8px', // Optional rounded corners
    padding: '8px',
    outline: 'none',
    transition: 'box-shadow 0.3s ease-in-out', // Smooth transition for the glow effect
  }}
  onFocus={(e) =>
    (e.target.style.boxShadow = '0 0 8px 2px rgba(76, 175, 80, 0.8)') // Green glow effect on focus
  }
  onBlur={(e) => (e.target.style.boxShadow = 'none')} // Remove glow effect on blur
/>


      <div className="chats">
        {chats?.map((chat, index) => (
          <ChatBox
            chat={chat}
            index={index}
            currentUser={currentUser}
            currentChatId={currentChatId}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
