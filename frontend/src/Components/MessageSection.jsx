import React from "react";
import ChatInput from "./ChatInput";
import Message from "./message";

const MessageSection = () => {
  return (
    <div className="flex flex-col flex-1 text-white bg-gray-700 rounded-b-2xl">
      <div className="w-full flex-1 overflow-y-auto p-4 text-white">
        <Message />
      </div>
      <ChatInput />
    </div>
  );
};

export default MessageSection;
