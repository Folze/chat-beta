import { getToken } from "./localCookie";
import { renderMessage } from "./chat";
import { scrollToBottom } from "./scroll";
import { UI } from "./ui";
import { renderLoadedMessage } from "./chat";
import { toggleModal } from "../main";

let displayedMessages = 20;

export function displayInitialMessages() {
  let check = localStorage.getItem("chatHistory");
  const parsedData = JSON.parse(check);
  const initialMessages = parsedData.slice(0, displayedMessages).reverse();

  initialMessages.forEach((message) => {
    renderMessage(message.text, message.user.name);
  });
}

export function loadMoreMessages() {
  // Сохранение текущей позиции прокрутки
  const oldScrollHeight = UI.chatBody.scrollHeight;
  const oldScrollTop = UI.chatBody.scrollTop;

  let check = localStorage.getItem("chatHistory");
  const parsedData = JSON.parse(check);
  const remainingMessages = parsedData.length - displayedMessages;
  if (remainingMessages <= 0) {
    console.log("Вся история загружена");
    return;
  }

  const messagesToAdd = Math.min(20, remainingMessages);
  const nextMessages = parsedData.slice(
    displayedMessages,
    displayedMessages + messagesToAdd
  );

  // Добавляем новые сообщения
  nextMessages
    .reverse()
    .forEach((message) => renderLoadedMessage(message.text, message.user.name));

  // Увеличиваем количество отображаемых сообщений
  displayedMessages += messagesToAdd;

  // Корректировка позиции прокрутки
  const newScrollHeight = UI.chatBody.scrollHeight;
  UI.chatBody.scrollTop = oldScrollTop + (newScrollHeight - oldScrollHeight);
}

export function fetchEmailRequest(email) {
  return fetch("https://edu.strada.one/api/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
      toggleModal(UI.modal, UI.modalOverlay, false);
      toggleModal(UI.modalSecond, UI.modalSecondOverlay, true);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export function fetchUserInfo(newName) {
  const token = getToken("authToken");
  if (!token) {
    console.error("Token not found");
    return;
  }
  return fetch("https://edu.strada.one/api/user", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: newName }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.name === getToken("username")) {
        console.log("Это текущее ваше имя");
        // Потом добавить в html
      } else {
        console.log("Username updated:", data);
        Cookies.set("username", newName, { expires: 7 });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export function fetchChatHistory() {
  const token = getToken("authToken");
  if (!token) {
    console.error("Token not found");
    return;
  }

  fetch("https://edu.strada.one/api/messages/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data.messages)) {
        localStorage.setItem("chatHistory", JSON.stringify(data.messages));
        displayInitialMessages();
        scrollToBottom();
      }
    })
    .catch((error) => {
      console.error("Error fetching chat history:", error);
    });
}
