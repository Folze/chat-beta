import { UI } from "./modules/ui.js";
import { connectWebSocket } from "./modules/websocket.js";
import { saveToken, getToken } from "./modules/localCookie.js";
import { sendMessage } from "./modules/chat.js";
import {
  fetchEmailRequest,
  fetchUserInfo,
  fetchChatHistory,
  loadMoreMessages,
} from "./modules/api.js";

export function toggleModal(modal, overlay, isVisible) {
  if (isVisible) {
    modal.style.display = "block";
    overlay.style.display = "block";
  } else {
    modal.style.display = "none";
    overlay.style.display = "none";
  }
}

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

//

window.addEventListener("load", () => {
  fetchChatHistory();
});

UI.chatBody.addEventListener("scroll", function () {
  if (UI.chatBody.scrollTop === 0) {
    loadMoreMessages();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const token = getToken("authToken");
  if (token) {
    connectWebSocket();
  }
});
