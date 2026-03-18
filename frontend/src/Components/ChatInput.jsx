import React, { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { addMessage } from "../store/chatSlice";

const ChatInput = () => {
  const [text, setText] = useState("");

  const dispatch = useDispatch();

  const { selectedConversationId } = useSelector((state) => state.chat);
  const user = useSelector((state) => state.auth.user);

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      const token = localStorage.getItem("token");

      console.log("[ChatInput] Sending message:", text);

      const res = await axios.post(
        `/api/conversations/${selectedConversationId}/send`,
        {
          senderId: user.userId,
          content: text,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
	
      console.log("[ChatInput] Message sent successfully");

      dispatch(addMessage(res.data));
      setText("");
    } catch (err) {
      console.error("[ChatInput] Send error:", err);
    }
  };

  console.log("[ChatInput] Conversation ID:", selectedConversationId);

  return (
    <div className="h-20 w-full px-4 py-3 flex items-center gap-3 bg-[#1f2933] /90 backdrop-blur-md border-t border-white/10">

      {/* 🔥 INPUT */}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        className="flex-1 h-11 px-4 bg-[#2b3642] text-white rounded-full outline-none border border-white/10 placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500/50 transition"
      />
	
      {/* 🔥 SEND BUTTON */}
      <button
        onClick={sendMessage}
        className="h-11 w-11 rounded-full bg-[#056162] hover:bg-[#0a7a7c] flex items-center justify-center active:scale-95 transition-all  shadow-md"
      >
        <img src="/send.png" alt="send" className="h-6 w-6" />
      </button>
    </div>
  );
};

export default ChatInput;