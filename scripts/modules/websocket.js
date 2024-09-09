import { savedToken } from "./localCookie";

export function connectWebSocket(token) {
  try {
    const socket = new WebSocket(
      `wss://edu.strada.one/websockets?${savedToken}`
    );

    socket.onopen = function (event) {
      console.log("WebSocket соединение установлено");
    };

    socket.onmessage = function (event) {
      const data = JSON.parse(event.data);
      const username = getToken("username");

      if (data.user.name !== username) {
        renderLoadedMessage(data.text, data.user.name);
      }
    };
  } catch (error) {
    console.error("Ошибка при подключении к WebSocket:", error);
  }
}
