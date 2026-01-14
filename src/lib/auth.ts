import Cookies from "js-cookie";

const TOKEN_KEY = "token";

export function setToken(token: string) {
  Cookies.set(TOKEN_KEY, token, { expires: 1 }); // 1 day
}

export function getToken() {
  return Cookies.get(TOKEN_KEY);
}

export function clearToken() {
  Cookies.remove(TOKEN_KEY);
}
