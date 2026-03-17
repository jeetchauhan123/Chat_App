import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import ChatPanel from "../Components/ChatPanel";
import { useSelector, useDispatch } from "react-redux";
import { startSignalRConnection, getConnection } from "../signalr";
import { addMessage } from "../store/chatSlice";

const Chat = () => {
  const [collapse, setCollapse] = useState(false);
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

  if (!user) {
    return <p className="p-5">User not found</p>;
  }

  console.log("chat", user);
  return (
    <section className="h-screen p-5 overflow-hidden relative flex gap-6 backdrop-blur-md">
      <img
        src="/chat_bg4.jpg"
        alt="bg_img"
        className="absolute top-0 left-0 w-full h-screen object-cover -z-10"
      />
      <div
        className={`${collapse ? "w-[5%]" : "w-[25%]"} relative transition-all duration-300 ease-in-out`}
      >
        {/* <div className={`w-[25%] relative transition-all`}> */}
        <div
          className="top-5 -right-5 w-5 h-10 flex items-center absolute bg-[#201919] rounded-tr-xl rounded-br-xl"
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
      <ChatPanel user={user} />
    </section>
  );
};

export default Chat;
