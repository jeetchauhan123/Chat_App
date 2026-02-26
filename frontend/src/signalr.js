import * as signalR from "@microsoft/signalr";

let connection = null;

export const startSignalRConnection = (token) => {
  connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7028/chatHub", {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build();

  return connection.start();
};

export const getConnection = () => connection;