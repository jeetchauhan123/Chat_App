import React from "react";

const Sidebar = ({ user }) => {
  console.log(user.contacts);
  return (
    <div className="w-[20vw] h-full  flex flex-col gap-5 bg-[#201919] rounded-2xl overflow-auto scroll-auto">
      <header>
        <h1 className="text-2xl text-white">{user?.name}</h1>
      </header>

      {/* chats contacts */}
      <main className="flex flex-col ">
        {user?.contacts?.map((c, index) => (
          <section
            key={index}
            className="flex flex-col rounded-xl"
          >
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
          <section
            key={index}
            className=""
          >
            <div className="">
              {/* name */}
              <span className="">{c.name}</span>

              {/* time */}
              <span className="text-xs text-gray-500"></span>
            </div>

            {/* last message */}
            <p className="text-sm text-gray-600 truncate">{c.lastMessage}</p>
          </section>
        ))}
        {user?.contacts?.map((c, index) => (
          <section
            key={index}
            className="bg-white p-3 rounded-xl cursor-pointer hover:bg-gray-100 transition"
          >
            <div className="flex justify-between items-center">
              {/* name */}
              <span className="font-semibold">{c.name}</span>

              {/* time */}
              <span className="text-xs text-gray-500"></span>
            </div>

            {/* last message */}
            <p className="text-sm text-gray-600 truncate">{c.lastMessage}</p>
          </section>
        ))}
      </main>
      <main className="flex flex-col gap-4"></main>
    </div>
  );
};

export default Sidebar;
