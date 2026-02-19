import React from "react";
import ChatInput from "./ChatInput";
import Message from "./message";
import data from "../data/mockMessages.json";

const MY_ID = "u1"; // ✅ ADD THIS

function groupByDate(messages) {
  const groups = {};

  messages.forEach((msg) => {
    const dateKey = formatDateLabel(msg.timestamp);

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }

    groups[dateKey].push(msg);
  });

  return groups;
}

function formatDateLabel(timestamp) {
  const msgDate = new Date(timestamp);
  const today = new Date();

  if (msgDate.toDateString() === today.toDateString()) {
    return "Today";
  }

  return msgDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}




const MessageSection = () => {
  const groupedMessages = groupByDate(data.messages)
  return (
    <div className="h-full flex flex-col text-white bg-gray-700">
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {Object.entries(groupedMessages).map(([date, messages]) => (
          <div key={date}>
            <div className="text-center text-xs text-gray-300 my-3 uppercase tracking-wider ">
              {date}
            </div>

            {messages.map((msg) => (
              <Message
                key={msg.id}
                text={msg.text}
                time={formatTime(msg.timestamp)}
                isOwn={msg.senderId === MY_ID}
              />
            ))}
          </div>
        ))}
      </div>
      {/* INPUT AREA: Stays fixed at the bottom */}
      <div className="shrink-0">
        <ChatInput />
      </div>
    </div>
  );
};

export default MessageSection;
