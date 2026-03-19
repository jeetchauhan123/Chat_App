import * as signalR from "@microsoft/signalr";

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
    })
    .withAutomaticReconnect()
    .build();

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