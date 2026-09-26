import axios from "axios";

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

export const logout = async () => {
  try {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
  } catch (error) {
    console.error("Logout failed:", error);
  }
  localStorage.removeItem(STORAGE_KEY);
};
