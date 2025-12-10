import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export const Sidebar = () => {
  const { usuario, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(true);

  if (!usuario) return null;

  const toggleMenu = () => setOpen(!open);

  const linkStyle =
    "flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-[#1f1f23] hover:text-white transition";

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-[#1a1a1d] p-2 rounded-lg border border-slate-700 shadow-lg"
        onClick={toggleMenu}
      >
        {open ? (
          <X size={22} color="white" />
        ) : (
          <Menu size={22} color="white" />
        )}
      </button>

      <aside
        className={`
          fixed top-0 left-0 h-full bg-[#121214] 
          border-r border-slate-800 shadow-xl
          transition-all duration-300 z-40
          ${open ? "w-64" : "w-0 md:w-20"}
        `}
      >
        <div
          className={`
            flex flex-col h-full overflow-hidden
            ${
              open
                ? "opacity-100 p-6"
                : "opacity-0 p-0 pointer-events-none md:pointer-events-auto"
            }
            transition-all duration-300
          `}
        >
          <h1 className="text-white text-xl font-semibold tracking-wide mb-10">
            QuantumTec LMS
          </h1>

          <nav className="flex flex-col gap-2">
            <Link to="/" className={linkStyle}>
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            {usuario.rol === "ADMIN" && (
              <>
                <Link to="/admin/usuarios" className={linkStyle}>
                  <Users size={18} />
                  Usuarios
                </Link>

                <Link to="/admin/cursos" className={linkStyle}>
                  <BookOpen size={18} />
                  Cursos
                </Link>
              </>
            )}

            {usuario.rol === "DOCENTE" && (
              <>
                <Link to="/docente/cursos" className={linkStyle}>
                  <BookOpen size={18} />
                  Mis Cursos
                </Link>

                <Link to="/docente/solicitudes" className={linkStyle}>
                  <Users size={18} />
                  Solicitudes de ingreso
                </Link>
              </>
            )}

            {usuario.rol === "ESTUDIANTE" && (
              <Link to="/estudiante/cursos" className={linkStyle}>
                <BookOpen size={18} />
                Cursos
              </Link>
            )}

            <Link to="/perfil" className={linkStyle}>
              <User size={18} />
              Perfil
            </Link>
          </nav>

          <div className="flex-1" />

          <button
            onClick={logout}
            className="
              flex items-center gap-3 px-4 py-2 rounded-lg
              text-red-400 hover:bg-red-900/30 hover:text-red-300
              transition border border-red-900/20
            "
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>

        {!open && (
          <div className="hidden md:flex flex-col items-center py-6 gap-6 text-gray-400">
            <Link to="/">
              <LayoutDashboard size={22} />
            </Link>

            {usuario.rol === "ADMIN" && (
              <>
                <Link to="/admin/usuarios">
                  <Users size={22} />
                </Link>

                <Link to="/admin/cursos">
                  <BookOpen size={22} />
                </Link>
              </>
            )}

            {usuario.rol === "DOCENTE" && (
              <>
                <Link to="/docente/cursos">
                  <BookOpen size={22} />
                </Link>

                <Link to="/docente/solicitudes">
                  <Users size={22} />
                </Link>
              </>
            )}

            {usuario.rol === "ESTUDIANTE" && (
              <Link to="/estudiante/cursos">
                <BookOpen size={22} />
              </Link>
            )}

            <Link to="/perfil">
              <User size={22} />
            </Link>

            <button onClick={logout}>
              <LogOut size={22} className="text-red-400 hover:text-red-300" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
