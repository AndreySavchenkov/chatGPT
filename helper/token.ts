const AUTH_TOKEN = "authToken";

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_TOKEN);
  }
  return null;
};

export const setToken = (token: string) => {
  if (typeof window !== 'undefined' && token) {
    localStorage.setItem(AUTH_TOKEN, token);
  }
};

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN);
  }
};