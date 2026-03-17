import React, { useEffect, useMemo, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import Message from "./message";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../store/chatSlice";

const MessageSection = () => {
  const dispatch = useDispatch();

  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const isFirstLoad = useRef(true);

  const { selectedConversationId, messages } = useSelector(
    (state) => state.chat,
  );

  const user = useSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  console.log("[MessageSection] Conversation:", selectedConversationId);
  console.log("[MessageSection] Messages count:", messages.length);

  // 🔥 RESET ON CHAT CHANGE
  useEffect(() => {
    console.log("[MessageSection] Conversation changed → reset scroll state");
    isFirstLoad.current = true;
    setShowScrollBtn(false);
  }, [selectedConversationId]);

  // 🔥 FETCH MESSAGES
  useEffect(() => {
    if (!selectedConversationId) {
      console.log("[MessageSection] No conversation selected");
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        console.log("[MessageSection] Fetching messages...");

        const res = await axios.get(
          `/api/conversations/${selectedConversationId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log(
          "[MessageSection] Messages fetched successfully:",
          res.data.length,
        );

        dispatch(setMessages(res.data));
      } catch (err) {
        console.error("[MessageSection] Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedConversationId, dispatch]);

  // 🔥 SCROLL DETECTION
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    const nearBottom = distanceFromBottom < 100;
    // Only log when state changes (avoid spam)
    if (nearBottom && showScrollBtn) {
      console.log("[Scroll] User reached bottom");
    }
    if (!nearBottom && !showScrollBtn) {
      console.log("[Scroll] User moved away from bottom");
    }
    setShowScrollBtn(!nearBottom);
  };

  // 🔥 AUTO SCROLL (SMART)
  useEffect(() => {
    if (!messages.length) return;
    const container = containerRef.current;
    if (!container) return;
    if (isFirstLoad.current) {
      console.log("[Scroll] First load → jump to bottom");
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      isFirstLoad.current = false;
      return;
    }
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    const nearBottom = distanceFromBottom < 100;
    if (nearBottom) {
      console.log("[Scroll] Auto scroll (user near bottom)");
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      console.log("[Scroll] New message but user is reading old messages");
      setShowScrollBtn(true);
    }
  }, [messages]);

  if (!selectedConversationId) return null;

  // 🔥 SORT + GROUP
  const groupedMessages = useMemo(() => {
    console.log("[MessageSection] Sorting & grouping messages");

    const sorted = [...messages].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    );

    return sorted.reduce((groups, msg) => {
      const key = new Date(msg.createdAt).toDateString();

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(msg);
      return groups;
    }, {});
  }, [messages]);

  // 🔥 DATE FORMATTER
  const formatDateLabel = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="h-full flex flex-col text-white bg-gradient-to-b from-gray-700 via-gray-750 to-gray-800 relative">
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
        <div ref={messagesEndRef} />
      </div>

      <div className="shrink-0">
        <ChatInput />
      </div>
    </div>
  );
};

export default MessageSection;
