import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedUser, setSelectedConversationId } from "../store/chatSlice";

const ChatNav = () => {
  const selectedUser = useSelector((state) => state.chat.selectedUser);
  const dispatch = useDispatch();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  console.log("[ChatNav] Render | User:", selectedUser?.name);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    console.log("[ChatNav] Mount");

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        console.log("[ChatNav] Click outside → closing menu");
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      console.log("[ChatNav] Unmount");
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCloseChat = () => {
    console.log("[ChatNav] Closing chat");

    dispatch(setSelectedUser(null));
    dispatch(setSelectedConversationId(null));
    setMenuOpen(false);
  };

  return (
    <section className="h-[8%] w-full px-6 flex justify-between items-center bg-[#2a2a2a] rounded-t-2xl border-b border-[#3a3a3a]">
      {/* LEFT: User Info */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative">
          <span className="w-10 h-10 flex items-center justify-center font-bold rounded-full text-white bg-linear-to-r from-teal-500 to-cyan-600 shadow-md">
            {selectedUser?.name?.charAt(0).toUpperCase()}
          </span>

          {/* Online Indicator (future-ready) */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#2a2a2a] rounded-full"></span>
        </div>

        {/* Name + Status */}
        <div className="flex flex-col leading-tight">
          <h1 className="text-xl font-semibold text-white">
            {selectedUser?.name}
          </h1>

          {/* Minimal status (no text overload) */}
          <span className="text-xs text-gray-400">Active</span>
        </div>
      </div>

      {/* RIGHT: Menu */}
      <div className="relative" ref={menuRef}>
        <div
          onClick={() => {
            console.log("[ChatNav] Toggle menu:", !menuOpen);
            setMenuOpen(!menuOpen);
          }}
          className="h-10 w-10 flex items-center justify-center hover:bg-[#9e9e9e33] rounded-full transition cursor-pointer"
        >
          <img
            src="/three-dots-menu.svg"
            alt="menu"
            className="w-7 h-7 opacity-80"
          />
        </div>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-[#1f1f1f] rounded-xl shadow-xl overflow-hidden z-50 border border-[#333] animate-fadeIn">
            <button
              // onClick={handleCloseChat}
              className="w-full text-left px-4 py-3 hover:bg-[#373131] text-white transition"
            >
              View profile
            </button>
            <button
              // onClick={handleCloseChat}
              className="w-full text-left px-4 py-3 hover:bg-[#373131] text-white transition"
            >
              Mute
            </button>
            <button
              onClick={handleCloseChat}
              className="w-full text-left px-4 py-3 hover:bg-[#373131] text-white transition"
            >
              Close Chat
            </button>
            <button
              // onClick={handleCloseChat}
              className="w-full text-left px-4 py-3 hover:bg-[#373131] text-white transition"
            >
              Delete chat
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ChatNav;
