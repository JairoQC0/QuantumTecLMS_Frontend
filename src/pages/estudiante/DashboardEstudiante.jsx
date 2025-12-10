import { useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";

export const DashboardEstudiante = () => {
  const { usuario } = useContext(AuthContext);

  return (
    <div>
      <h1>Dashboard Estudiante</h1>
      <p>Bienvenido {usuario.nombre}</p>
    </div>
  );
};
