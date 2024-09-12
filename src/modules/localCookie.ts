import Cookies from "js-cookie";

export function saveToken(token) {
  Cookies.set("authToken", token, { expires: 14 });
}

//
export function getToken(token) {
  return Cookies.get(token);
}

export const savedToken = getToken("authToken");
