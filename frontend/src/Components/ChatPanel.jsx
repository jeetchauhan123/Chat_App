import React from "react";
import ChatNav from "./ChatNav";
import MessageSection from "./MessageSection";

const ChatPanel = (user) => {
  console.log("userpanel", user);
  return (
    <div className="w-[80%] h-full flex flex-col bg-[#a75757] rounded-4xl relative">
      <ChatNav user={user.user} />
      <div className="flex-1 min-h-0">
        <MessageSection />
      </div>
    </div>
  );
};

export default ChatPanel;
