import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import users from "../data/users.json";

const Chat = () => {
  const location = useLocation();
  const loggedUserName = location.state?.user?.name;

  const user = users.find((u) => u.name === loggedUserName);

  if (!user) {
    return <p className="p-5">User not found</p>;
  }

  console.log("chat", user);
  return (
    <section className="h-screen p-5 overflow-hidden relative">
      <img src="/chat_bg4.jpg" alt="bg_img" className="absolute object-cover top-0 left-0 -z-10" />
      <Sidebar user={user} />
    </section>
  );
};

export default Chat;
