import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedUser, setSelectedConversationId } from "../store/chatSlice";

const ChatNav = () => {
  const selectedUser = useSelector((state) => state.chat.selectedUser);
  const dispatch = useDispatch();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCloseChat = () => {
    dispatch(setSelectedUser(null));
    dispatch(setSelectedConversationId(null));
    setMenuOpen(false);
  };

  return (
    <section className="h-[8%] w-full px-6 py-4 flex justify-between items-center bg-[#2a2a2a] rounded-t-2xl">
      <div className="flex items-center gap-4">
        <span className="w-10 h-10 p-4 flex items-center justify-center font-bold rounded-full text-amber-800 bg-[#9e9e9e]">
          {selectedUser?.name?.charAt(0).toUpperCase()}
        </span>
        <h1 className="text-2xl font-semibold text-white">
          {selectedUser?.name}
        </h1>
      </div>

      <div className="relative" ref={menuRef}>
        <div
          onClick={() => setMenuOpen(!menuOpen)}
          className="h-10 w-10 hover:bg-[#9e9e9e89] p-1 rounded-full transition cursor-pointer"
        >
          <img src="/three-dots-menu.svg" alt="menu" />
        </div>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-[#1f1f1f] rounded-lg shadow-lg overflow-hidden z-50">
            <button
              onClick={handleCloseChat}
              className="w-full text-left px-4 py-3 hover:bg-[#373131] text-white transition"
            >
              Close Chat
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ChatNav;
