import { UI } from "./ui.js";
import Cookies from "js-cookie";

function renderMessage(message, username, isOutgo) {
  const messageClone = UI.template.content.cloneNode(true);
  const nicknameDiv = messageClone.querySelector(".nickname");
  const textDiv = messageClone.querySelector(".text");
  const messageDiv = messageClone.querySelector("div");

  nicknameDiv.textContent = username;
  textDiv.textContent = message;

  if (isOutgo === savedToken) {
    messageDiv.classList.add("person1");
  } else {
    messageDiv.classList.add("person2");
  }

  UI.chatBody.appendChild(messageClone);

  UI.messageInput.value = "";
}

function sendMessage() {
  const message = UI.messageInput.value.trim();
  if (message === "") return;

  const username = getToken("username") || "Anonim";

  renderMessage(message, username, savedToken);
}

function toggleModal(modal, overlay, isVisible) {
  if (isVisible) {
    modal.style.display = "block";
    overlay.style.display = "block";
  } else {
    modal.style.display = "none";
    overlay.style.display = "none";
  }
}

function fetchEmailRequest(email) {
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

function fetchUserInfo(newName) {
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

function fetchChatHistory() {
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
      console.log(data);
      if (Array.isArray(data.messages)) {
        data.messages.forEach((message) => {
          renderMessage(message.text, message.user.name, message._id);
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching chat history:", error);
    });
}
// Установка куки

function saveToken(token) {
  Cookies.set("authToken", token, { expires: 7 });
}

function getToken(token) {
  return Cookies.get(token);
}

const savedToken = getToken("authToken");

// События

UI.form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage();
});

// 1 modal
UI.authorization.addEventListener("click", (event) => {
  event.preventDefault();
  toggleModal(UI.modal, UI.modalOverlay, true);
});

UI.modalClose.addEventListener("click", () => {
  toggleModal(UI.modal, UI.modalOverlay, false);
});
UI.modalOverlay.addEventListener("click", () => {
  toggleModal(UI.modal, UI.modalOverlay, false);
});

UI.modalBtnGetCode.addEventListener("click", (event) => {
  event.preventDefault();
  const email = UI.modalInputAut.value;
  fetchEmailRequest(email);
});

// 2 modal
UI.btnEnterCode.addEventListener("click", (event) => {
  event.preventDefault();
  toggleModal(UI.modal, UI.modalOverlay, false);
  toggleModal(UI.modalSecond, UI.modalSecondOverlay, true);
});

UI.modalSecondOverlay.addEventListener("click", () => {
  toggleModal(UI.modalSecond, UI.modalSecondOverlay, false);
});

UI.modalSecondClose.addEventListener("click", () => {
  toggleModal(UI.modalSecond, UI.modalSecondOverlay, false);
});

UI.modalSecondBtn.addEventListener("click", (event) => {
  event.preventDefault();
  toggleModal(UI.modalSecond, UI.modalSecondOverlay, false);
  const token = UI.modalSecondToken.value;
  saveToken(token);
});

// 3 modal settings
UI.settings.addEventListener("click", (event) => {
  event.preventDefault();
  toggleModal(UI.modalSettings, UI.modalSettingsOverlay, true);
});

UI.modalSettingsClose.addEventListener("click", () => {
  toggleModal(UI.modalSettings, UI.modalSettingsOverlay, false);
});

UI.modalSettingsOverlay.addEventListener("click", () => {
  toggleModal(UI.modalSettings, UI.modalSettingsOverlay, false);
});

UI.modalSettingsBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const newName = UI.modalSettingsInput.value.trim();
  fetchUserInfo(newName);
  setTimeout(() => {
    toggleModal(UI.modalSettings, UI.modalSettingsOverlay, false);
  }, 200);
});

window.addEventListener("load", () => {
  fetchChatHistory();
});
