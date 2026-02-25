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

      const res = await axios.post(
        `/api/conversations/${selectedConversationId}/send`,
        {
          senderId: user.userId,
          content: text
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      dispatch(addMessage(res.data));
      setText("");
    } catch (err) {
      console.log(err);
    }
  };

  console.log("Conversation ID:", selectedConversationId);

  return (
    <div className="h-20 w-full px-4 flex items-center gap-4 bg-[#434343] rounded-b-2xl ">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 h-12 px-4 bg-gray-500 rounded-full outline-none"
        placeholder="Type a message"
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />

      <button
        onClick={sendMessage}
        className="h-12 w-12 rounded-full hover:bg-[#5c5c5c] flex items-center justify-center transition"
      >
        <img src="/send.png" alt="send" className="h-7 w-7" />
      </button>
    </div>
  );
};

export default ChatInput;