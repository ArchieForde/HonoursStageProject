import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const API = "http://localhost:5000/api/auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // On mount, try to restore session
  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${API}/me`, {
          headers: { Authorization: `Bearer ${savedToken}` },
        });
        setUser(res.data);
        setToken(savedToken);
      } catch {
        localStorage.removeItem("token");
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const register = async (username, password) => {
    const res = await axios.post(`${API}/register`, { username, password });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const login = async (username, password) => {
    const res = await axios.post(`${API}/login`, { username, password });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("gameWishlist");
    setToken(null);
    setUser(null);
  };

  const saveWishlist = async (wishlist) => {
    if (!token) return;
    try {
      const res = await axios.put(
        `${API}/wishlist`,
        { wishlist },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
    } catch (err) {
      console.error("Failed to save wishlist:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout, saveWishlist }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
