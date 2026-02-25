import React, { useEffect } from "react";
import ChatInput from "./ChatInput";
import Message from "./message";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../store/chatSlice";

const MessageSection = () => {
  const dispatch = useDispatch();

  const { selectedConversationId, messages } = useSelector(
    (state) => state.chat,
  );

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!selectedConversationId) return;

    const token = localStorage.getItem("token");

    axios
      .get(`/api/conversations/${selectedConversationId}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        dispatch(setMessages(res.data));
      })
      .catch((err) => console.log(err));
  }, [selectedConversationId, dispatch]);

  if (!selectedConversationId) return null;

  return (
    <div className="h-full flex flex-col text-white bg-gray-700">
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {messages.map((msg) => (
          <Message
            key={msg.messageId}
            text={msg.content}
            time={new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            isOwn={msg.senderId === user.userId}
          />
        ))}
      </div>

      <div className="shrink-0">
        <ChatInput />
      </div>
    </div>
  );
};

export default MessageSection;
