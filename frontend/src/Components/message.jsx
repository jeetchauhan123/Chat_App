import React from "react";

const Message = ({ text, time, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-[70%] px-4 py-2 flex flex-col rounded-2xl backdrop-blur-md border border-white/10 shadow-md ${
          isOwn
            ? "bg-[#056162] text-white rounded-br-sm"
            : "bg-[#2f3d3d] text-gray-100 rounded-bl-sm"
        }`}
      >

        {/* 🔥 MESSAGE TEXT */}
        <span className="text-[15px] leading-relaxed wrap-break-word">
          {text}
        </span>	

        {/* 🔥 TIME */}
        <span className={`text-[10px] self-end mt-1 ${isOwn ? "text-teal-100/90" : "text-gray-300/85"}`}>
          {time}
        </span>
      </div>
    </div>
  );
};

export default Message;
