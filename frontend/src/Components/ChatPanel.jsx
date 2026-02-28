import React from "react";
import ChatNav from "./ChatNav";
import MessageSection from "./MessageSection";
import { useSelector } from "react-redux";

const ChatPanel = () => {
  const selectedUser = useSelector((state) => state.chat.selectedUser);

  if (!selectedUser) {
    return (
      <div className="w-full h-full flex justify-center items-center bg-[#2a2a2a] rounded-3xl shadow-[0_0_50px_-20px] shadow-[#f5deb3c3]">
        <video
          src="/message5.mp4"
          className="w-120 h-120 rounded-3xl object-cover drop-shadow-[0_0_50px] drop-shadow-[#f5deb3c3]"
          autoPlay
          loop
          muted
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#2a2a2a] rounded-3xl overflow-hidden">
      <ChatNav />
      <div className="flex-1 min-h-0">
        <MessageSection />
      </div>
    </div>
  );
};

export default ChatPanel;
