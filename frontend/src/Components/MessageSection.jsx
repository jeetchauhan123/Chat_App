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

  const API = import.meta.env.VITE_API_URL;


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
          `${API}/api/conversations/${selectedConversationId}/messages`,
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
  <div className="h-full flex flex-col text-white bg-linear-to-b from-gray-700 via-gray-800 to-gray-900 relative">
    {/* 🔥 RADIAL LIGHT EFFECT (TOP GLOW) */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-teal-500/10 blur-3xl pointer-events-none" />

    {/* 🔥 SUBTLE OVERLAY (DEPTH) */}
    <div className="absolute inset-0 bg-black/20 pointer-events-none" />

    {/* 🔥 MESSAGE AREA */}
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar relative z-10"
    >
      {/* LOADING */}
      {loading && (
        <p className="text-center text-gray-400 animate-pulse">
          Loading messages...
        </p>
      )}

      {/* EMPTY */}
      {!loading && messages.length === 0 && (
        <p className="text-center text-gray-400">No messages yet</p>
      )}

      {/* MESSAGE */}
      {/* <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar"> */}
      {Object.entries(groupedMessages).map(([date, msgs]) => (
        <div key={date} className="space-y-3">
          {/* DATE LABEL */}
        <div className="sticky top-2 z-20 flex justify-center">
          <span className="px-4 py-1.5 text-xs tracking-wide bg-gray-800/70 backdrop-blur-md border border-white/10 text-gray-300 rounded-full shadow-lg">
            {formatDateLabel(date)}
          </span>
          </div>

          {/* 🔥 MESSAGE STACK */}
          <div className="space-y-2">
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
        </div>
      ))}
      <div ref={messagesEndRef} />
      {/* </div> */}
    </div>

    {/* 🔥 SCROLL BUTTON */}
    {showScrollBtn && (
      <div className="absolute bottom-24 right-6 z-40">
        <button
          onClick={() => {
            console.log("[Scroll] Manual scroll to bottom clicked");

            messagesEndRef.current?.scrollIntoView({
              behavior: "smooth"
            });
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-teal-600/90 backdrop-blur-md hover:bg-teal-500 text-sm font-medium shadow-xl shadow-teal-900/30 border border-white/10 transition-all duration-200"
        >
          ↓ New Messages
        </button>
      </div>
    )}
    
    {/* 🔥 INPUT */}
    <div className="shrink-0 border-t border-white/10 bg-[#2f2f2f]/80 backdrop-blur-lg z-30">
      <ChatInput />
    </div>
  </div>
);
};

export default MessageSection;
