import { UI } from "./ui";

export function scrollToBottom() {
  UI.chatBody.scrollTop = UI.chatBody.scrollHeight;
}
