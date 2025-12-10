import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./auth/AuthContext";

// Public
import { LoginPage } from "./pages/LoginPage";

// Perfil
import { PerfilPage } from "./pages/perfil/PerfilPage";
import { CambiarContrasenaPage } from "./pages/perfil/CambiarContrasenaPage";

// Admin
import { DashboardAdmin } from "./pages/admin/DashboardAdmin";
import { UsuariosPage } from "./pages/admin/UsuariosPage";
import { CursosAdminPage } from "./pages/admin/CursosAdminPage";

// Docente
import { DashboardDocente } from "./pages/docente/DashboardDocente";
import { DocenteCursosPage } from "./pages/docente/DocenteCursosPage";
import { DocenteSolicitudesPage } from "./pages/docente/DocenteSolicitudesPage";
// Estudiante
import { DashboardEstudiante } from "./pages/estudiante/DashboardEstudiante";
import { EstudianteCursosPage } from "./pages/estudiante/EstudianteCursosPage";

// Components
import { Sidebar } from "./components/Sidebar";
import { PrivateRoute } from "./auth/PrivateRoute";

export default function App() {
  const { usuario } = useContext(AuthContext);

  return (
    <>
      {usuario && <Sidebar />}

      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              {usuario?.rol === "ADMIN" && <DashboardAdmin />}
              {usuario?.rol === "DOCENTE" && <DashboardDocente />}
              {usuario?.rol === "ESTUDIANTE" && <DashboardEstudiante />}
            </PrivateRoute>
          }
        />

        {/* Perfil */}
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <PerfilPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/perfil/cambiar-contrasena"
          element={
            <PrivateRoute>
              <CambiarContrasenaPage />
            </PrivateRoute>
          }
        />

        {/* Rutas Admin */}
        <Route
          path="/admin/usuarios"
          element={
            <PrivateRoute>
              <UsuariosPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/cursos"
          element={
            <PrivateRoute>
              <CursosAdminPage />
            </PrivateRoute>
          }
        />

        {/* Rutas Docente */}
        <Route
          path="/docente/cursos"
          element={
            <PrivateRoute>
              <DocenteCursosPage />
            </PrivateRoute>
          }
        />
        <Route path="/docente/cursos" element={<DocenteCursosPage />} />
        <Route
          path="/docente/solicitudes"
          element={<DocenteSolicitudesPage />}
        />

        {/* Rutas Estudiante */}
        <Route
          path="/estudiante/cursos"
          element={
            <PrivateRoute>
              <EstudianteCursosPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}
