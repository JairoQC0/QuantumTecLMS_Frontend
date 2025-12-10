import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthProvider";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="w-full bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-bold text-lg">
          QuantumTec LMS
        </Link>

        {user && (
          <div className="flex gap-3 text-sm">
            {user.role === "STUDENT" && (
              <>
                <Link to="/student" className="hover:underline">
                  Mis cursos
                </Link>
                <Link to="/" className="hover:underline">
                  Catálogo
                </Link>
              </>
            )}

            {user.role === "TEACHER" && (
              <>
                <Link to="/teacher" className="hover:underline">
                  Mis cursos
                </Link>
                <Link to="/" className="hover:underline">
                  Catálogo
                </Link>
              </>
            )}

            {user.role === "ADMIN" && (
              <>
                <Link to="/admin/users" className="hover:underline">
                  Usuarios
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 text-sm">
        {user ? (
          <>
            <span>
              {user.name} · <span className="uppercase">{user.role}</span>
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded bg-red-500 hover:bg-red-600"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700"
          >
            Iniciar sesión
          </Link>
        )}
      </div>
    </nav>
  );
}
