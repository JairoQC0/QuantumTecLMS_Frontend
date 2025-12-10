import { useContext } from "react";
import { AuthContext } from "./auth/AuthProvider";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Cargando...</p>;

  if (!user) return <Navigate to="/login" />;

  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

  return children;
};
