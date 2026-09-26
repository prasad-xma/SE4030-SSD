import axios from "axios";

// The JWT lives in an HttpOnly cookie that JavaScript cannot read.
// Only the non-secret user info returned by the login API (id and role) is kept here,
// for UI routing. The backend still verifies the cookie on every protected request.
const STORAGE_KEY = "authUser";
const API_URL = "http://localhost:3000/api/auth";

export const setAuthUser = (user) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ userId: user.id, role: user.role }));
};

export const getAuthUser = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
};

// ask the backend who is logged in, based on the HttpOnly cookie
export const fetchCurrentUser = async () => {
  try {
    const res = await axios.get(`${API_URL}/me`, { withCredentials: true });
    setAuthUser(res.data.data);
    return getAuthUser();
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

// the HttpOnly cookie can only be cleared by the server
export const logout = async () => {
  try {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
  } catch (error) {
    console.error("Logout failed:", error);
  }
  localStorage.removeItem(STORAGE_KEY);
};
