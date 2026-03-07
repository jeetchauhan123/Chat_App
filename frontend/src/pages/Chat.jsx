import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import ChatPanel from "../Components/ChatPanel";
import { useSelector, useDispatch } from "react-redux";
import { startSignalRConnection, getConnection } from "../signalr";
import { addMessage } from "../store/chatSlice";

const Chat = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  console.log(user);

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");

    startSignalRConnection(token)
      .then(() => {
        const connection = getConnection();

        connection.on("ReceiveMessage", (message) => {
          console.log("Message received from SignalR:", message);
          dispatch(addMessage(message));
        });

        console.log("SignalR Connected");
      })
      .catch((err) => console.log("SignalR Error:", err));
  }, [user]);

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
    <section className="h-screen p-5 overflow-hidden relative flex flex-row gap-6">
      <img
        src="/chat_bg4.jpg"
        alt="bg_img"
        className="absolute top-0 left-0 w-full h-screen object-cover -z-10"
      />
      <div className="w-[25%] relative">
        <div className="top-5 -right-5 w-5 h-10 flex items-center absolute bg-[#201919] rounded-tr-xl rounded-br-xl">
          <img src="/arrow5.png" alt="" className="h-5 " />
        </div>
        <Sidebar user={user} />
      </div>
      <ChatPanel user={user} />
    </section>
  );
};

export default Chat;
