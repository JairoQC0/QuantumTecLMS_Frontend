import { useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";

export const DashboardDocente = () => {
  const { usuario } = useContext(AuthContext);

  return (
    <div>
      <h1>Dashboard Docente</h1>
      <p>Bienvenido {usuario.nombre}</p>
    </div>
  );
};
