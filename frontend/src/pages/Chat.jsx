import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import ChatPanel from "../Components/ChatPanel";
import { useSelector, useDispatch } from "react-redux";
import { startSignalRConnection, getConnection } from "../signalr";
import { addMessage } from "../store/chatSlice";

const Chat = () => {
  const [collapse, setCollapse] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  console.log(user);

  useEffect(() => {
    console.log("[Chat] Layout mounted");
    return () => console.log("[Chat] Layout unmounted");
  }, []);

  useEffect(() => {
    const handleResize = () => {
      console.log("[Chat] Window resized:", window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    console.log("[Chat] useEffect triggered");

    if (!user) {
      console.log("[Chat] No user, skipping SignalR setup");
      return;
    }

    let connection;

    const setup = async () => {
      try {
        const token = localStorage.getItem("token");

        console.log("[SignalR] Token:", token ? "Exists" : "Missing");

        console.log("[SignalR] Starting connection...");
        await startSignalRConnection(token);

        connection = getConnection();

        console.log("[SignalR] Connection object:", connection);

        if (!connection) {
          console.error("[SignalR] Connection is null!");
          return;
        }

        console.log("[SignalR] Removing old listener (if any)");
        connection.off("ReceiveMessage");

        console.log("[SignalR] Adding ReceiveMessage listener");

        connection.on("ReceiveMessage", (message) => {
          console.log("[SignalR] Message received:", message);

          if (!message) {
            console.warn("[SignalR] Empty message received");
            return;
          }

          dispatch(addMessage(message));
        });

        console.log("[SignalR] Listener attached successfully");
      } catch (err) {
        console.error("[SignalR] Setup error:", err);
      }
    };

    setup();

    return () => {
      console.log("[Chat] Cleanup triggered");

      if (connection) {
        console.log("[SignalR] Removing listener on cleanup");
        connection.off("ReceiveMessage");
      }
    };
  }, [user, dispatch]);

  if (loading)
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <video
          src="/chat-loading2.mp4"
          autoPlay
          loop
          muted
          className="h-fit w-fit object-cover"
        />
      </div>
    );

  console.log("chat", user);
  return (
    <section className="w-full h-screen p-4 overflow-hidden relative flex gap-6 backdrop-blur-md">
      <img
        src="/chat_bg4.jpg"
        alt="bg_img"
        className="absolute top-0 left-0 w-full h-screen object-cover -z-10"
      />

      {/* Sidebar */}
      <div
        className={`
          ${isMobile ? "fixed top-0 left-0 h-full z-50" : "relative"}
          
          ${
            isMobile
              ? collapse
                ? "-translate-x-[96%] shadow-none" // almost hidden (only 5% visible)
                : "translate-x-0"
              : collapse
                ? "flex-[0_0_70px]"
                : "flex-[0_0_240px] md:flex-[0_0_260px] lg:flex-[0_0_300px]"
          }

          ${isMobile ? "w-[75%]" : "min-w-[20px] md:min-w-[20px]"}
          transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] shadow-[0_0_50px_-20px] shadow-[#f5deb3c3] rounded-2xl
        `}
      >
        <div
          className={`absolute top-5 ${
            isMobile ? "right-[-20px]" : "-right-5"
          } w-6 h-12 flex items-center justify-center bg-[#201919] rounded-r-xl z-50 cursor-pointer`}
          onClick={() => setCollapse(!collapse)}
        >
          <img
            src="/arrow5.png"
            alt=""
            className={`h-5 transition ${collapse ? "rotate-0" : "-rotate-180"}`}
          />
        </div>
        <Sidebar collapse={collapse} />
      </div>

      {/* Chat Panel */}
      <div
        className={`
          flex-1 min-w-0 overflow-hidden shadow-[0_0_40px_-20px_#f5deb3c3]
          
          ${isMobile && !collapse ? "blur-sm" : ""}
          
          ${isMobile && collapse ? "ml-[14px]" : ""}
          
          transition-all duration-300 rounded-3xl
        `}
      >
        <ChatPanel />
      </div>
    </section>
  );
};

export default Chat;
