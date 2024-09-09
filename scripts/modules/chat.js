import { UI } from "./ui";
import { getToken } from "./localCookie";

export function renderMessage(message, username) {
  const messageClone = UI.template.content.cloneNode(true);
  const nicknameDiv = messageClone.querySelector(".nickname");
  const textDiv = messageClone.querySelector(".text");
  const messageDiv = messageClone.querySelector("div");

  nicknameDiv.textContent = username;
  textDiv.textContent = message;

  const isOutgoingMessage = username === getToken("username");
  messageDiv.classList.add(isOutgoingMessage ? "person1" : "person2");

  UI.chatBody.appendChild(messageClone);

  UI.messageInput.value = "";
}

export function renderLoadedMessage(message, username) {
  const messageClone = UI.template.content.cloneNode(true);
  const nicknameDiv = messageClone.querySelector(".nickname");
  const textDiv = messageClone.querySelector(".text");
  const messageDiv = messageClone.querySelector("div");

  nicknameDiv.textContent = username;
  textDiv.textContent = message;

  const isOutgoingMessage = username === getToken("username");
  messageDiv.classList.add(isOutgoingMessage ? "person1" : "person2");

  UI.chatBody.prepend(messageClone);
}

export function sendMessage() {
  const message = UI.messageInput.value.trim();
  if (message === "") return;

  const username = getToken("username") || "Anonim";

  renderMessage(message, username);
  socket.send(JSON.stringify({ text: message }));
  scrollToBottom();
}
