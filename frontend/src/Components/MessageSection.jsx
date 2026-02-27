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

  // Sort messages by time
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  );

  // Group messages by date
  const groupedMessages = sortedMessages.reduce((groups, msg) => {
    const dateKey = new Date(msg.createdAt).toDateString();

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }

    groups[dateKey].push(msg);
    return groups;
  }, {});

  const formatDateLabel = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();

    const isToday = date.toDateString() === today.toDateString();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    return date.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="h-full flex flex-col text-white bg-gray-700">
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            <div className="text-center text-xs text-gray-400 my-4 font-medium">
              {formatDateLabel(date)}
            </div>

            {msgs.map((msg) => (
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
        ))}
      </div>

      <div className="shrink-0">
        <ChatInput />
      </div>
    </div>
  );
};

export default MessageSection;
