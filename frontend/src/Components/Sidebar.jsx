import React, { useState } from "react";

const Sidebar = ({ user }) => {
  const [collapsed, setCollapsed] = useState(false);

  console.log(user.contacts);
  return (
    <aside
      className={`h-full flex flex-col bg-[#201919] rounded-2xl overflow-hidden transition-all duration-500 ease-in-out
        ${collapsed ? "w-0 opacity-0 genie-collapse" : "w-[25%] opacity-100 genie-open"}
      `}
    >
      <header className="flex justify-between items-center gap-4 px-6 py-5 border-b border-gray-800">
        <div className="flex items-center gap-4 min-w-[150px]">
          <h1 className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-white text-amber-600 font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </h1>
          <h1 className="text-xl font-semibold text-gray-300 truncate">
            {user?.name}
          </h1>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white transition-all z-50 p-2"
        >
          {collapsed ? "➡" : "☰"}
        </button>
      </header>

      {/* chats contacts */}
      <main className="flex flex-col ">
        {user?.contacts?.map((c, index) => (
          <section key={index} className="flex flex-col rounded-xl">
            <div className="px-5 py-6 rounded-xl cursor-pointer hover:bg-[#373131] transition">
              <div className="flex flex-row justify-between items-center text-white">
                {/* name */}
                <span className="text-lg font-semibold">{c.name}</span>

                {/* time */}
                <span className="text-[#acacac] text-xs ">
                  {new Date(c.lastMessageTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* last message */}
              <p className="truncate  text-[#acacac] ">{c.lastMessage}</p>
            </div>
            <hr className="text-[#575454] mx-4" />
          </section>
        ))}
        {user?.contacts?.map((c, index) => (
          <section key={index} className="flex flex-col rounded-xl">
            <div className="px-5 py-6 rounded-xl cursor-pointer hover:bg-[#373131] transition">
              <div className="flex flex-row justify-between items-center text-white">
                {/* name */}
                <span className="text-lg font-semibold">{c.name}</span>

                {/* time */}
                <span className="text-[#acacac] text-xs ">
                  {new Date(c.lastMessageTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* last message */}
              <p className="truncate  text-[#acacac] ">{c.lastMessage}</p>
            </div>
            <hr className="text-[#575454] mx-4" />
          </section>
        ))}
      </main>
      <main className="flex flex-col gap-4"></main>
    </aside>
  );
};

export default Sidebar;
