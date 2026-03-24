import React, { useRef, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { addMessage } from "../store/chatSlice";

const ChatInput = () => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const API = import.meta.env.VITE_API_URL;

  const { selectedConversationId } = useSelector((state) => state.chat);
  const user = useSelector((state) => state.auth.user);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const tempId = Date.now(); // 🔥 TEMP ID

    const tempMessage = {
      tempId,
      conversationId: selectedConversationId,
      senderId: user.userId,
      content: text,
      createdAt: new Date().toISOString(),
      status: "sending",
    };

    // ✅ 1. INSTANT UI UPDATE
    dispatch(addMessage(tempMessage));

    setText(""); // clear input immediately

    try {
      const token = localStorage.getItem("token");

      console.log("[ChatInput] Sending message:", text);

      await axios.post(
        `${API}/api/conversations/${selectedConversationId}/send`,
        {
          senderId: user.userId,
          content: tempMessage.content,
          clientTempId: tempId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("[ChatInput] Message sent successfully");
    } catch (err) {
      console.error("[ChatInput] Send error:", err);
      
      // ❌ mark message as failed
      dispatch(
        addMessage({
          tempId,
          status: "failed",
        }),
      );
    }
  };

  const handleAttachClick = () => {
    console.log("[ChatInput] Attach button clicked");
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    console.log("[ChatInput] File selected:", selectedFile);

    setFile(selectedFile);
  };

  const removeFile = () => {
    console.log("[ChatInput] File removed");
    setFile(null);
    fileInputRef.current.value = "";
  };

  console.log("[ChatInput] Conversation ID:", selectedConversationId);

  // return (
  //   <div className="w-full px-4 py-3 bg-[#1f2933] border-t border-white/10">
  //     <div className="flex items-center gap-2 bg-[#2b3642] rounded-full px-2 py-1 shadow-inner border border-white/10 focus-within:ring-2 focus-within:ring-teal-500/40 transition">

  //       {/* 🔥 LEFT ACTION (ATTACHMENT) */}
  //       <button
  //         onClick={handleAttachClick}
  //         className="h-10 w-10 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/5 active:scale-90 transition-all duration-200"
  //       >
  //         <svg className="w-6 h-6">
  //           <use href="/icons.svg#clip-icon"></use>
  //         </svg>
  //       </button>

  //       {file && (
  //         <div className="mx-2 px-3 py-1 bg-[#2b3642] border border-white/10 rounded-lg flex items-center justify-between text-sm text-gray-300">
  //           <span className="truncate max-w-[70%]">📎{file.name}</span>

  //           <button
  //             onClick={removeFile}
  //             className="text-red-400 hover:text-red-300 transition"
  //           >
  //             ✕
  //           </button>
  //         </div>
  //       )}

  //       {/* 🔥 INPUT */}
  //       <input
  //         type="text"
  //         value={text}
  //         onChange={(e) => setText(e.target.value)}
  //         placeholder="Type a message..."
  //         onKeyDown={(e) => e.key === "Enter" && sendMessage()}
  //         className="flex-1 bg-transparent text-white outline-none px-2 placeholder:text-gray-400"
  //       />

  //       {/* 🔥 SEND BUTTON */}
  //       <button
  //         onClick={sendMessage}
  //         className={`h-10 w-10 flex items-center justify-center rounded-full bg-[#056162] hover:bg-[#0a7a7c] active:bg-[#0d8f91] transition-all shadow-md
  //         ${text.trim() ? "opacity-100 scale-100" : "opacity-50 scale-95"}
  //       `}
  //         disabled={!text.trim()}
  //       >
  //         <img src="/send.png" alt="send" className="h-5 w-5" />
  //       </button>
  //     </div>
  //     <input
  //       type="file"
  //       ref={fileInputRef}
  //       onChange={handleFileChange}
  //       className="hidden"
  //     />
  //   </div>
  // );
  return (
    <div className="w-full px-4 py-3 bg-[#1f2933] border-t border-white/10 flex flex-col">
      {/* 🟢 NEW: File Preview Shelf (Now sits ABOVE the input) */}
      {file && (
        <div className="w-fit flex items-center justify-between mb-2 px-3 py-2 bg-[#2b3642] border border-white/10 rounded-lg animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-teal-400">📎</span>
            <span className="text-sm text-gray-300 truncate">{file.name}</span>
          </div>
          <button
            onClick={removeFile}
            className="ml-2 h-6 w-6 flex items-center justify-center rounded-full bg-white/5 text-red-400 hover:bg-red-500/10 transition"
          >
            ✕
          </button>
        </div>
      )}

      {/* 🔥 INPUT BAR (Stays consistent width) */}
      <div className="flex items-center gap-2 bg-[#2b3642] rounded-full px-2 py-1 shadow-inner border border-white/10 focus-within:ring-2 focus-within:ring-teal-500/40 transition">
        {/* LEFT ACTION (ATTACHMENT) */}
        <button
          onClick={handleAttachClick}
          className="shrink-0 h-10 w-10 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/5 active:scale-90 transition-all duration-200"
        >
          <svg className="w-6 h-6">
            <use href="/icons.svg#clip-icon"></use>
          </svg>
        </button>

        {/* INPUT (Added 'min-w-0' to prevent flex blowout) */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 min-w-0 bg-transparent text-white outline-none px-2 placeholder:text-gray-400"
        />

        {/* SEND BUTTON */}
        <button
          onClick={sendMessage}
          className={`shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-[#056162] hover:bg-[#0a7a7c] active:bg-[#0d8f91] transition-all shadow-md 
          ${text.trim() ? "opacity-100 scale-100" : "opacity-50 scale-95"}
        `}
          disabled={!text.trim()}
        >
          <img src="/send.png" alt="send" className="h-5 w-5" />
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ChatInput;
