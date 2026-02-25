import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setConversations, setSelectedUser, setSelectedConversationId } from "../store/chatSlice";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const conversations = useSelector((state) => state.chat.conversations);

  useEffect(() => {
    if (!user?.userId) return;

    axios
      .get(`/api/sidebar/conversations/${user.userId}`)
      .then((res) => {
        dispatch(setConversations(res.data));
      })
      .catch((err) => console.log(err));
  }, [user]);

  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    axios
      .get(`/api/users/search?query=${searchTerm}`)
      .then((res) => setSearchResults(res.data))
      .catch((err) => console.log(err));
  }, [searchTerm]);

  const onSearchClick = async (u) => {
    setSearchTerm("");

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "/api/conversations/private",
        {
          user1Id: user.userId,
          user2Id: u.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      dispatch(setSelectedUser(u));
      dispatch(setSelectedConversationId(res.data.conversationId));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <aside
      className={`w-[20%] h-full flex flex-col gap-1 bg-[#201919] rounded-2xl overflow-auto shadow-[0_0_50px_-20px] shadow-[#f5deb3c3]
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

      <div className="px-4 py-3">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-full bg-[#2d2424] text-white outline-none"
        />
      </div>

      <main className="flex flex-col">
        {searchResults.length > 0 && (
          <div>
            {searchResults.map((u) => (
              <div
                key={u.userId}
                onClick={() => onSearchClick(u)}
                className="px-5 py-4 hover:bg-[#373131] cursor-pointer text-white"
              >
                {u.name}
              </div>
            ))}
            <hr className="text-[#575454] mx-4" />
          </div>
        )}
        {conversations.length === 0 ? (
          <div className="text-gray-400 p-6">
            Start having conversations with people you know.
          </div>
        ) : (
          conversations.map((c) => (
            <section
              key={c.conversationId}
              className="flex flex-col rounded-xl"
            >
              <div className="px-5 py-6 rounded-xl cursor-pointer hover:bg-[#373131] transition">
                <div className="flex flex-row justify-between items-center text-white">
                  <span className="text-lg font-semibold">
                    Conversation {c.conversationId}
                  </span>

                  <span className="text-[#acacac] text-xs">
                    {new Date(c.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <p className="truncate text-[#acacac]">
                  Last message coming soon...
                </p>
              </div>
              <hr className="text-[#575454] mx-4" />
            </section>
          ))
        )}
      </main>
    </aside>
  );
};

export default Sidebar;

// {user?.contacts?.map((c, index) => (
//           <section key={index} className="flex flex-col rounded-xl">
//             <div className="px-5 py-6 rounded-xl cursor-pointer hover:bg-[#373131] transition">
//               <div className="flex flex-row justify-between items-center text-white">
//                 {/* name */}
//                 <span className="text-lg font-semibold">{c.name}</span>

//                 {/* time */}
//                 <span className="text-[#acacac] text-xs ">
//                   {new Date(c.lastMessageTime).toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </span>
//               </div>

//               {/* last message */}
//               <p className="truncate  text-[#acacac] ">{c.lastMessage}</p>
//             </div>
//             <hr className="text-[#575454] mx-4" />
//           </section>
//         ))}
