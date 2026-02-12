import React from "react";

const Sidebar = ({ user }) => {
  console.log(user);
  return (
    <div className="w-[20vw] h-full p-5 flex flex-col gap-5 bg-amber-200 rounded-2xl">
      <header>
        <h1 className="text-2xl">{user?.name}</h1>
      </header>

      {/* chats contacts */}
      
      <main className="flex flex-col gap-4">
        {user?.contacts?.map((c, index) => (
          <section
            key={index}
            className="bg-white p-3 rounded-xl cursor-pointer hover:bg-gray-100 transition"
          >
            <div className="flex justify-between items-center">
              {/* name */}
              <span className="font-semibold">{c.name}</span>

              {/* time */}
              <span className="text-xs text-gray-500">
                {new Date(c.lastMessageTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {/* last message */}
            <p className="text-sm text-gray-600 truncate">{c.lastMessage}</p>
          </section>
        ))}
      </main>
    </div>
  );
};

export default Sidebar;
