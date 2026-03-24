import * as signalR from "@microsoft/signalr";
import { store } from "./store/store";
import { updateSidebarFromSocket } from "./store/chatSlice";
import { addMessage } from "./store/chatSlice";
import { replaceTempMessage } from "./store/chatSlice";

let connection = null;

export const startSignalRConnection = async (token) => {
  const API = import.meta.env.VITE_API_URL;

  if (connection) {
    console.log("[SignalR] Connection already exists");
    return;
  }

  console.log("[SignalR] Creating new connection...");

  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${API}/chatHub`, {
      accessTokenFactory: () => token,
      withCredentials: true,
    })
    .withAutomaticReconnect()
    .build();

  connection.on("UpdateSidebar", (data) => {
    console.log("[SignalR] Sidebar update received:", data);

    store.dispatch(updateSidebarFromSocket(data));
  });

  connection.on("ReceiveMessage", (data) => {
    console.log("[SignalR] Message received:", data);

    const state = store.getState();
    const messages = state.chat.messages;
    
    store.dispatch(addMessage(data));
  });

  try {
    await connection.start();
    console.log("[SignalR] Connection started");
  } catch (err) {
    console.error("[SignalR] Start failed:", err);
  }
};

export const getConnection = () => {
  if (!connection) {
    console.warn("[SignalR] No connection found");
  }
  return connection;
};
