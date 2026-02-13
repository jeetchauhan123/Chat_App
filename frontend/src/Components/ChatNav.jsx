import React from "react";

const ChatNav = (user) => {
    console.log("chatnav",user)
  return (
    <section className="p-4  bg-[#494949] rounded-t-2xl">
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 p-4 flex items-center justify-center font-bold rounded-full bg-[#9e9e9e]">
          {user?.user?.name?.charAt(0).toUpperCase()}
        </span>
        <h1 className="text-2xl">{user.user.name}</h1>
      </div>
    </section>
  );
};

export default ChatNav;
