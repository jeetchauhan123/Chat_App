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

const Sidebar = ({ collapse }) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const menuRef = useRef(null);

  const user = useSelector((state) => state.auth.user);
  const conversations = useSelector((state) => state.chat.conversations);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

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
          `/api/sidebar/conversations/${user.userId}`,
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

        const res = await axios.get(`/api/users/search?query=${searchTerm}`);

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
        "/api/conversations/private",
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
    localStorage.removeItem("token");
    dispatch(setUser(null));
    navigate("/auth");
  };

  /* ---------------- RENDER ---------------- */

  return (
    <aside className="w-full h-full flex flex-col bg-[#201919] rounded-2xl overflow-auto shadow-[0_0_50px_-20px] shadow-[#f5deb3c3]">
      {/* sidebar nav */}
      <header className="flex justify-between items-center shadow-md shadow-gray-700">
        {!collapse ? (
          <div className="px-6 py-5 flex items-center gap-4">
            <h1 className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-amber-600 font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </h1>

            <h1 className="text-xl font-semibold text-gray-300">
              {user?.name}
            </h1>
          </div>
        ) : (
          <div className="w-full h-18 flex items-center justify-center">
            <h1 className="w-11 h-11 flex items-center justify-center rounded-full bg-white text-2xl text-amber-600 font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </h1>
          </div>
        )}

        {/* menu button hamburger */}
        {!collapse && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-400 hover:text-white px-6 py-5"
            >
              ☰
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-[#1f1f1f] rounded-lg shadow-lg overflow-hidden z-50">
                <button
                  onClick={handlelogout}
                  className="w-full text-left px-4 py-3 hover:bg-[#373131] text-white transition"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* search bar */}
      {!collapse && (
        <div className="px-4 py-3">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => {
              console.log("[Sidebar] Search input:", e.target.value);
              setSearchTerm(e.target.value);
            }}
            className="w-full px-4 py-2 rounded-full bg-[#2d2424] text-white outline-none"
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
                  className="px-5 py-4 hover:bg-[#373131] cursor-pointer text-white"
                >
                  {u.name}
                </div>
              ))
            ) : (
              <div className="px-5 py-4 text-white">No User Found</div>
            )}
            <hr className="text-[#575454] mx-4" />
          </div>
        )}

        {/* Chats */}
        {conversations.length === 0 ? (
          <div className="text-gray-400 p-6">
            Start having conversations with people you know.
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
              }}
            >
              {/* open sidebar chat */}
              {!collapse ? (
                <div className="w-full px-4 flex items-center gap-4 rounded-3xl cursor-pointer hover:bg-[#373131]">
                  <div className="w-10">
                    <h1 className="w-10 h-10  flex items-center justify-center rounded-full bg-white text-amber-600 font-bold">
                      {c.otherUser?.name?.[0]?.toUpperCase()}
                    </h1>
                  </div>

                  <div className="w-full py-6 flex flex-col">
                    <div className="flex justify-between items-center text-white">
                      <span className="text-lg font-semibold">
                        {c.otherUser?.name || "Unknown User"}
                      </span>

                      <span className="text-[#acacac] text-xs">
                        {new Date(c.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <p className="truncate text-[#acacac]">
                      {c.lastMessage || "No messages yet"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full flex items-center justify-center my-4">
                  <h1 className="w-11 h-11  flex items-center justify-center cursor-pointer rounded-full bg-white text-amber-600 font-bold transition hover:scale-110 hover:shadow-[0_0_20px_#696767]">
                    {c.otherUser?.name?.[0]?.toUpperCase()}
                  </h1>
                </div>
              )}
              {!collapse && <hr className="text-[#575454] w-[87%]" />}
            </section>
          ))
        )}
      </main>
    </aside>
  );
};

export default Sidebar;
