import React from "react";
import ChatNav from "./ChatNav";
import MessageSection from "./MessageSection";
import { useSelector } from "react-redux";

const ChatPanel = () => {
  const selectedUser = useSelector((state) => state.chat.selectedUser);
  console.log("[ChatPanel] Selected user:", selectedUser);
  if (!selectedUser) {
    return (
      <div className="w-full h-full min-w-0 flex justify-center items-center relative bg-[#2a2a2a] rounded-3xl shadow-[0_0_50px_-20px] shadow-[#f5deb3c3] overflow-hidden">
        <video
          src="/message5.mp4"
          className="w-70 sm:w-100 md:w-120 h-70 sm:h-100 md:h-120 rounded-3xl object-cover drop-shadow-[0_0_50px] drop-shadow-[#f5deb3c3]"
          autoPlay
          loop
          muted
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full min-w-0 flex flex-col bg-[#2a2a2a]  overflow-hidden border relative border-[#3a3a3a] ">

      {/* Top Nav */}
      <ChatNav />	

      {/* Messages */}
      <div className="flex-1 min-h-0 min-w-0 relative overflow-hidden">
        <MessageSection />
      </div>

      {/* Optional: future overlay (typing / reconnecting etc) */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-sm text-gray-400 z-30">
        Typing...
      </div>
    </div>
  );
};

export default ChatPanel;
