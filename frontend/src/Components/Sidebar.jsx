import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import {
  setConversations,
  setSelectedUser,
  setSelectedConversationId,
} from "../store/chatSlice";
import { getConnection } from "../signalr";

const Sidebar = ({ collapse }) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const menuRef = useRef(null);

  const API = import.meta.env.VITE_API_URL;

  const user = useSelector((state) => state.auth.user);
  const conversations = useSelector((state) => state.chat.conversations);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  /*handle off click menu close*/
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- FETCH CONVERSATIONS ---------------- */
  useEffect(() => {
    console.log("[Sidebar] Component rendered");
    console.log("[Sidebar] Current user:", user);

    if (!user?.userId) {
      console.log("[Sidebar] User ID not available, skipping fetch");
      return;
    }

    const fetchConversations = async () => {
      console.log("[Sidebar] Fetching conversations for user:", user.userId);

      try {
        const res = await axios.get(
          `${API}/api/sidebar/conversations/${user.userId}`,
        );

        console.log("[Sidebar] Conversations received:", res.data);

        dispatch(setConversations(res.data));
      } catch (err) {
        console.error("[Sidebar] Failed to fetch conversations:", err);
      }
    };

    fetchConversations();
  }, [user?.userId, dispatch]);

  /* ---------------- SEARCH USERS ---------------- */
  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }
    console.log("[Sidebar] Search term changed:", searchTerm);

    const delayDebounce = setTimeout(async () => {
      try {
        console.log("[Sidebar] Searching users...");

        const res = await axios.get(
          `${API}/api/users/search?query=${searchTerm}`,
        );

        console.log("[Sidebar] Search results:", res.data);

        setSearchResults(res.data);
      } catch (err) {
        console.error("[Sidebar] User search failed:", err);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  /* ---------------- START PRIVATE CHAT ---------------- */
  const onSearchClick = async (selectedUser) => {
    console.log("[Sidebar] User selected from search:", selectedUser);

    setSearchTerm("");

    try {
      const token = localStorage.getItem("token");

      console.log(
        "[Sidebar] Creating private conversation with:",
        selectedUser.userId,
      );

      const res = await axios.post(
        `${API}/api/conversations/private`,
        {
          user1Id: user.userId,
          user2Id: selectedUser.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("[Sidebar] Conversation created:", res.data);
      dispatch(setSelectedUser(selectedUser));
      dispatch(setSelectedConversationId(res.data.conversationId));
    } catch (err) {
      console.error("[Sidebar] Failed to create conversation:", err);
    }
  };

  const handlelogout = () => {
    const connection = getConnection();

    if (connection) {
      console.log("[SignalR] Stopping connection on logout");
      connection.stop();
    }

    localStorage.removeItem("token");
    dispatch(setUser(null));
    navigate("/auth");
  };

  /* ---------------- RENDER ---------------- */
  return (
    <aside className="w-full h-full max-w-full flex flex-col bg-[#201919]/95 backdrop-blur-md rounded-2xl overflow-hidden ">
      {/* sidebar nav */}
      <header className="flex justify-between items-center px-2 shadow-md shadow-gray-700">
        {!collapse ? (
          <div className="px-4 py-4 flex items-center gap-3">
            <h1 className="w-11 h-11 flex items-center justify-center rounded-full bg-linear-to-br from-white to-gray-300 text-amber-600 font-bold text-lg shadow">
              {user?.name?.[0]?.toUpperCase()}
            </h1>

            <h1 className="text-lg font-semibold text-gray-200 tracking-wide">
              {user?.name}
            </h1>
          </div>
        ) : (
          <div className="w-full py-4 flex items-center justify-center">
            <h1 className="w-11 h-11 flex items-center justify-center rounded-full bg-white text-amber-600 text-lg font-bold shadow">
              {user?.name?.[0]?.toUpperCase()}
            </h1>
          </div>
        )}

        {/* menu button hamburger */}
        {!collapse && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-400 hover:text-white px-4 py-4 text-xl transition cursor-pointer"
            >
              ☰
            </button>

            {menuOpen && (
              <div className="absolute right-2 mt-2 w-44 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-xl overflow-hidden z-50 animate-fadeIn">
                <button
                  onClick={handlelogout}
                  className="w-full text-left px-4 py-3 hover:bg-[#2f2a2a] text-white transition"
                >
                  🚪 Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* search bar */}
      {!collapse && (
        <div className="px-4 py-3 border-b border-[#2a2222]">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => {
              console.log("[Sidebar] Search input:", e.target.value);
              setSearchTerm(e.target.value);
            }}
            className="w-full px-4 py-2 rounded-full bg-[#2d2424] text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-600 transition"
          />
        </div>
      )}

      {/* existing chats */}
      <main className="flex flex-col">
        {/* Search Results */}
        {!collapse && searchTerm && (
          <div>
            {searchResults.length > 0 ? (
              searchResults.map((u) => (
                <div
                  key={u.userId}
                  onClick={() => onSearchClick(u)}
                  className="px-5 py-3 hover:bg-[#2f2a2a] cursor-pointer text-white transition"
                >
                  {u.name}
                </div>
              ))
            ) : (
              <div className="px-5 py-3 text-gray-400">No User Found</div>
            )}
            <hr className="text-[#575454] mx-4" />
          </div>
        )}

        {/* Chats */}
        {conversations.length === 0 ? (
          <div className="text-gray-400 p-6 text-center">
            Start having conversations with people you know. 👋
          </div>
        ) : (
          conversations.map((c) => (
            <section
              key={c.conversationId}
              className="w-full flex flex-col items-center"
              onClick={() => {
                console.log(
                  "[Sidebar] Conversation selected:",
                  c.conversationId,
                );
                dispatch(setSelectedConversationId(c.conversationId));
                dispatch(
                  setSelectedUser({
                    userId: c.otherUser?.userId,
                    name: c.otherUser?.name,
                  }),
                );
                // ✅ CLOSE SIDEBAR ON MOBILE
                if (window.innerWidth < 768) {
                  setCollapse(true);
                }
              }}
            >
              {/* open sidebar chat */}
              {!collapse ? (
                <div className="w-full px-4 py-3 flex items-center gap-4 rounded-xl cursor-pointer hover:bg-[#2f2a2a] transition min-w-0">
                  <div className="w-10">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-amber-600 font-bold shadow">
                      {c.otherUser?.name?.[0]?.toUpperCase()}
                    </div>
                  </div>

                  <div className="w-full flex flex-col overflow-hidden min-w-0">
                    <div className="flex justify-between items-center text-white">
                      <span className="text-base font-semibold truncate max-w-[140px] md:max-w-[160px] lg:max-w-[180px]">
                        {c.otherUser?.name || "Unknown User"}
                      </span>

                      <span className="text-[#9e9e9e] text-xs shrink-0 ml-2">
                        {new Date(c.lastMessageTime || c.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <p className="text-[#9e9e9e] text-sm truncate">
                      {c.lastMessage || "No messages yet"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full flex items-center justify-center my-3">
                  <h1 className="w-11 h-11  flex items-center justify-center cursor-pointer rounded-full bg-white text-amber-600 font-bold transition hover:scale-110 hover:shadow-[0_0_15px_#888]">
                    {c.otherUser?.name?.[0]?.toUpperCase()}
                  </h1>
                </div>
              )}
              {!collapse && <hr className="text-[#3a3333] w-[85%]" />}
            </section>
          ))
        )}
      </main>
    </aside>
  );
};

export default Sidebar;
