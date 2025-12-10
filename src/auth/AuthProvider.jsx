import { createContext, useState, useEffect } from "react";
import { api } from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // persistencia de sesión
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setLoading(false);

    api
      .get("/auth/me")
      .then((res) => setUser(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.data.token);
    setUser(res.data.data.user);
  };

  const register = async (values) => {
    const res = await api.post("/auth/register", values);
    localStorage.setItem("token", res.data.data.token);
    setUser(res.data.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
