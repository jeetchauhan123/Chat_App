import React from "react";

const Message = ({ text, time, isOwn }) => {
  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}
    >
      <div
        className={`max-w-[70%] rounded-t-2xl px-4 py-2 flex flex-col ${
          isOwn ? "bg-[#056162] rounded-bl-2xl" : "bg-[#262d31] rounded-br-2xl"
        }`}
      >
        <span className="text-sm text-white">{text}</span>
        <span className="text-[10px] text-gray-300 self-end mt-1">{time}</span>
      </div>
    </div>
  );
};

export default Message;

{
  /* <div className="flex justify-end px-3 py-1">
      <div className="max-w-[70%] bg-[#4f4f4f] text-white rounded-2xl px-4 py-2 flex flex-col">
        <span className="text-sm">this is last message</span>
        <span className="text-[10px] text-gray-300 self-end mt-1">2:16 PM</span>
      </div>
    </div> */
}
