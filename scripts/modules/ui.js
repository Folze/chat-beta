const getElement = (element) => document.querySelector(element);

const UI = {
  form: getElement(".chat__send__form"),
  buttonSend: getElement(".chat__btn__send"),
  messageInput: getElement(".chat__send__message"),
  chatBody: getElement(".chat__body"),
  authorization: getElement(".header__button__authorization"),
  settings: getElement(".header__button__settings"),
  // 1
  modal: getElement(".modal"),
  modalOverlay: getElement(".modal__overlay"),
  modalClose: getElement(".modal__close"),
  modalInputAut: getElement(".modal__input"),
  modalBtnGetCode: getElement(".modal__get__code"),
  // 2
  modalSecond: getElement(".modal__second"),
  modalSecondOverlay: getElement(".modal__second__overlay"),
  modalSecondClose: getElement(".modal__second__close"),
  modalSecondToken: getElement(".modal__second__input"),
  modalSecondBtn: getElement(".modal__welcome__button"),
  // 3
  modalSettingsOverlay: getElement(".modal__settings__overlay"),
  modalSettings: getElement(".modal__settings"),
  modalSettingsClose: getElement(".modal__settings__close"),
  modalSettingsInput: getElement(".modal__settings__input"),
  modalSettingsBtn: getElement(".modal__settings__btn"),

  btnEnterCode: getElement("#enter-code"),
  template: getElement("#message"),
};

if (!UI.template) {
  console.error(
    "Шаблон сообщения не найден. Проверьте наличие элемента с id 'message' в вашем HTML."
  );
}

export { UI };
