import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ GLOBAL SCAN STATE
  const [activeScan, setActiveScanState] = useState(null);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
  });

  // ✅ Attach token automatically
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // ✅ SAFE SETTER (sync with localStorage)
  const setActiveScan = (data) => {
    setActiveScanState(data);
    localStorage.setItem("lastScan", JSON.stringify(data));
  };

  // ✅ Load user
  const loadUser = async () => {
    if (!localStorage.getItem('token')) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem('token');
      setUser(null);
    }
    setLoading(false);
  };

  // ✅ Load last scan from localStorage (safe parsing)
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

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;


    return res.data;
  };

  const googleLogin = async (credential) => {
    const res = await api.post('/auth/google-login', { credential });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    const savedScan = localStorage.getItem("lastScan");
    if (savedScan) {
      setActiveScan(JSON.parse(savedScan));
    }


    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
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