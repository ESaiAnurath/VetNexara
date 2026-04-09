import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Global scan state
  const [activeScan, setActiveScanState] = useState(null);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true // ✅ Send cookies/credentials with every request
  });

  // ✅ Attach token automatically to every request
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // ✅ Global response error handler
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid — auto logout
        localStorage.removeItem('token');
        setUser(null);
      }
      return Promise.reject(error);
    }
  );

  // ✅ Safe setter — syncs with localStorage
  const setActiveScan = (data) => {
    setActiveScanState(data);
    if (data) {
      localStorage.setItem("lastScan", JSON.stringify(data));
    } else {
      localStorage.removeItem("lastScan");
    }
  };

  // ✅ Load user from token
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      console.error("Failed to load user:", err?.response?.data || err.message);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load user + last scan on app start
  useEffect(() => {
    loadUser();

    try {
      const savedScan = localStorage.getItem("lastScan");
      if (savedScan) {
        setActiveScanState(JSON.parse(savedScan));
      }
    } catch (err) {
      console.error("Error parsing saved scan:", err);
      localStorage.removeItem("lastScan");
    }
  }, []);

  // ✅ Login — FIXED (removed duplicate return)
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data; // ✅ Only one return
  };

  // ✅ Google Login — FIXED (safe JSON parse)
  const googleLogin = async (credential) => {
    const res = await api.post('/auth/google-login', { credential });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);

    try {
      const savedScan = localStorage.getItem("lastScan");
      if (savedScan) {
        setActiveScan(JSON.parse(savedScan));
      }
    } catch (err) {
      console.error("Error restoring scan after Google login:", err);
    }

    return res.data;
  };

  // ✅ Register
  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  // ✅ Logout — clears everything
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('lastScan');
    setUser(null);
    setActiveScanState(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      googleLogin,
      register,
      logout,
      api,
      activeScan,
      setActiveScan
    }}>
      {children}
    </AuthContext.Provider>
  );
};
