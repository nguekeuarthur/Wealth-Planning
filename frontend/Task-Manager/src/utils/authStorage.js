const ACCESS_TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "wp_user";

const listeners = new Set();

const notify = () => {
  const session = getSession();
  listeners.forEach((listener) => listener(session));
};

export const getSession = () => {
  const rawUser = localStorage.getItem(USER_KEY);
  return {
    token: localStorage.getItem(ACCESS_TOKEN_KEY),
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
    user: rawUser ? JSON.parse(rawUser) : null,
  };
};

export const setSession = ({ user, token, refreshToken }) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  notify();
};

export const clearSession = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  notify();
};

export const subscribeSession = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

