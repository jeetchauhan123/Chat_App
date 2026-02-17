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
    <div className="flex flex-col flex-1 text-white bg-gray-700 rounded-b-2xl">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-end">
        {Object.entries(groupedMessages).map(([date, messages]) => (
          <div key={date}>
            <div className="text-center text-xs text-gray-300 my-3">
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
      <ChatInput />
    </div>
  );
};

export default MessageSection;
