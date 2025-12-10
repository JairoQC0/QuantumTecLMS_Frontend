import { useEffect, useState } from "react";
import { api } from "../../api/api";
import {
  Plus,
  Search,
  UserCog,
  Pencil,
  Trash,
  RefreshCcw,
  X,
  Shield,
  Users,
} from "lucide-react";

export const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [rolFiltro, setRolFiltro] = useState("TODOS");

  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    rol: "ESTUDIANTE",
  });

  const cargarUsuarios = async () => {
    const { data } = await api.get("/usuarios");
    setUsuarios(data.datos);
  };

  useEffect(() => {
    const fetchUsuarios = async () => {
      const { data } = await api.get("/usuarios");
      setUsuarios(data.datos);
    };
    fetchUsuarios();
  }, []);

  const abrirModalCrear = () => {
    setEditando(null);
    setForm({ nombre: "", correo: "", contrasena: "", rol: "ESTUDIANTE" });
    setModal(true);
  };

  const abrirModalEditar = (u) => {
    setEditando(u.id);
    setForm({
      nombre: u.nombre,
      correo: u.correo,
      contrasena: "",
      rol: u.rol,
    });
    setModal(true);
  };

  const actualizarCampo = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const guardarUsuario = async () => {
    if (editando) {
      await api.put(`/usuarios/${editando}`, form);
    } else {
      await api.post("/usuarios", form);
    }
    cargarUsuarios();
    setModal(false);
  };

  const eliminarUsuario = async (id) => {
    await api.delete(`/usuarios/${id}`);
    cargarUsuarios();
  };

  const restaurarUsuario = async (id) => {
    await api.put(`/usuarios/${id}/restaurar`);
    cargarUsuarios();
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const coincide = u.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideRol = rolFiltro === "TODOS" || u.rol === rolFiltro;
    return coincide && coincideRol;
  });

  return (
    <div className="min-h-screen bg-dark p-10 md:ml-64 transition-all">
      {/* Header */}
      <div className="mb-10 flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <UserCog size={36} className="text-primary" />
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Gestión de Usuarios
          </h1>
        </div>

        <button
          onClick={abrirModalCrear}
          className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-white px-5 py-2.5 rounded-lg transition font-medium shadow-lg"
        >
          <Plus size={18} /> Nuevo Usuario
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Buscar */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-3 text-gray-500" />
          <input
            className="w-full bg-[#1a1b1e] border border-slate-700 rounded-lg px-10 py-2 text-white focus:ring-primary focus:ring-2"
            placeholder="Buscar usuario..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* Filtro de rol */}
        <select
          className="bg-[#1a1b1e] border border-slate-700 text-white px-4 py-2 rounded-lg"
          value={rolFiltro}
          onChange={(e) => setRolFiltro(e.target.value)}
        >
          <option value="TODOS">Todos los roles</option>
          <option value="ADMIN">Admin</option>
          <option value="DOCENTE">Docente</option>
          <option value="ESTUDIANTE">Estudiante</option>
        </select>

        {/* Total usuarios */}
        <div className="flex items-center gap-3 bg-[#1b1c1f] border border-slate-700 p-3 rounded-lg text-gray-300">
          <Users /> Total:{" "}
          <span className="text-white font-semibold">{usuarios.length}</span>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-[#141416] border border-slate-800 shadow-xl rounded-xl overflow-auto">
        <table className="w-full text-left">
          <thead className="bg-[#1b1c1f] text-gray-400 text-sm">
            <tr>
              <th className="px-6 py-4">Nombre</th>
              <th className="px-6 py-4">Correo</th>
              <th className="px-6 py-4">Rol</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="text-white">
            {usuariosFiltrados.map((u) => (
              <tr
                key={u.id}
                className="border-t border-slate-800 hover:bg-[#1a1b1e] transition"
              >
                <td className="px-6 py-4">{u.nombre}</td>
                <td className="px-6 py-4 text-gray-300">{u.correo}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-lg bg-primary/20 text-primary">
                    {u.rol}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {u.eliminado ? (
                    <span className="text-red-400">Inactivo</span>
                  ) : (
                    <span className="text-green-400">Activo</span>
                  )}
                </td>

                <td className="px-6 py-4 flex justify-end gap-3">
                  <button
                    onClick={() => abrirModalEditar(u)}
                    className="text-blue-400 hover:text-blue-300 transition"
                  >
                    <Pencil size={18} />
                  </button>

                  {!u.eliminado ? (
                    <button
                      onClick={() => eliminarUsuario(u.id)}
                      className="text-red-400 hover:text-red-300 transition"
                    >
                      <Trash size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={() => restaurarUsuario(u.id)}
                      className="text-green-400 hover:text-green-300 transition"
                    >
                      <RefreshCcw size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {usuariosFiltrados.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-10">
                  No hay usuarios para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-[#141416] border border-slate-700 p-8 rounded-2xl w-full max-w-lg shadow-2xl relative animate-[fadeIn_0.2s_ease]">
            {/* Cerrar */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setModal(false)}
            >
              <X size={20} />
            </button>

            <h2 className="text-white text-2xl font-semibold mb-6 flex items-center gap-2">
              <Shield className="text-primary" />
              {editando ? "Editar Usuario" : "Nuevo Usuario"}
            </h2>

            <div className="grid grid-cols-1 gap-5">
              <input
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={actualizarCampo}
                className="input-dark"
              />

              <input
                name="correo"
                placeholder="Correo"
                value={form.correo}
                onChange={actualizarCampo}
                className="input-dark"
              />

              {!editando && (
                <input
                  name="contrasena"
                  placeholder="Contraseña"
                  value={form.contrasena}
                  onChange={actualizarCampo}
                  className="input-dark"
                />
              )}

              <select
                name="rol"
                value={form.rol}
                onChange={actualizarCampo}
                className="input-dark"
              >
                <option value="ADMIN">Admin</option>
                <option value="DOCENTE">Docente</option>
                <option value="ESTUDIANTE">Estudiante</option>
              </select>

              <button
                onClick={guardarUsuario}
                className="mt-4 bg-primary hover:bg-primary/80 text-white py-3 rounded-lg transition font-medium shadow-lg"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
