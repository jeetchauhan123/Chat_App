import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import ChatPanel from "../Components/ChatPanel";
import { useSelector } from "react-redux";

const Chat = () => {
  const user = useSelector((state) => state.auth.user);
  console.log(user);

  if (!user) {
    return <p className="p-5">User not found</p>;
  }

  console.log("chat", user);
  return (
    <section className="h-screen p-5 overflow-hidden relative flex flex-row gap-4">
      <img
        src="/chat_bg4.jpg"
        alt="bg_img"
        className="absolute top-0 left-0 w-full h-screen object-cover -z-10"
      />
      <Sidebar user={user} />
      <ChatPanel user={user} />
    </section>
  );
};

export default Chat;
