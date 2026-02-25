import React from "react";
import { useSelector } from "react-redux";


const ChatNav = () => {
  const selectedUser = useSelector((state) => state.chat.selectedUser);

  return (
    <section className="h-[8%] w-full px-6 py-4 flex justify-between items-center bg-[#2a2a2a] rounded-t-2xl">
      <div className="flex items-center gap-4">
        <span className="w-10 h-10 p-4 flex items-center justify-center font-bold rounded-full bg-[#9e9e9e]">
          {selectedUser?.name?.charAt(0).toUpperCase()}
        </span>
        <h1 className="text-2xl font-semibold">{selectedUser?.name}</h1>
      </div>

      <div className="h-10 w-10 hover:bg-[#9e9e9e89] p-1 rounded-full transition">
        <img src="/three-dots-menu.svg" alt="menu" className="" />
      </div>
    </section>
  );
};

export default ChatNav;
