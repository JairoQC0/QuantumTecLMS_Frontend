import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { api } from "../api/api";

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCargando(false);
      return;
    }

    const cargarPerfil = async () => {
      try {
        const { data } = await api.get("/usuarios/me");
        setUsuario(data.datos);
      } catch {
        localStorage.removeItem("token");
        setUsuario(null);
      } finally {
        setCargando(false);
      }
    };

    cargarPerfil();
  }, []);

  const login = async (correo, contrasena) => {
    const { data } = await api.post("/autenticacion/login", {
      correo,
      contrasena,
    });

    const token = data.datos.token;
    const usuarioLogeado = data.datos.usuario;

    localStorage.setItem("token", token);
    setUsuario(usuarioLogeado);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        cargando,
        login,
        logout,
      }}
    >
      {!cargando && children}
    </AuthContext.Provider>
  );
};
