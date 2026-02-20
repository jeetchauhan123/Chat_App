import React, { useState } from "react";

const Sidebar = ({ user }) => {
  const [collapsed, setCollapsed] = useState(false);

  console.log(user.contacts);
  return (
    <aside
      className={`w-[20%] h-full flex flex-col gap-1 bg-[#201919] rounded-2xl overflow-auto 
        ${collapsed ? "genie-collapse" : "genie-open"}`}
    >
      <header className="flex justify-between items-center gap-4 px-6 py-5 rounded-t-2xl shadow-md shadow-gray-700">
        <div className="flex items-center gap-4">
          <h1 className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-amber-600 font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </h1>
          {!collapsed && (
            <h1 className="text-xl font-semibold text-gray-300">
              {user?.name}
            </h1>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white transition"
        >
          ☰
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
