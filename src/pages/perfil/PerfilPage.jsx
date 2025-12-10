import { useContext, useEffect, useState } from "react";
import { api } from "../../api/api";
import { AuthContext } from "../../auth/AuthContext";

export const PerfilPage = () => {
  const { usuario, setUsuario } = useContext(AuthContext);

  const [form, setForm] = useState({ nombre: "", correo: "" });
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (!usuario) return;

    queueMicrotask(() => {
      setForm({
        nombre: usuario.nombre,
        correo: usuario.correo,
      });
    });
  }, [usuario]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const actualizarPerfil = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.put("/usuarios/me", form);

      setUsuario(data.datos);
      setMensaje("✓ Cambios guardados correctamente");

      setTimeout(() => setMensaje(""), 2500);
    } catch {
      setMensaje("Error al actualizar perfil.");
    }
  };

  return (
    <div className="min-h-screen bg-dark px-6 py-10 flex justify-center relative overflow-hidden">
      <div className="absolute top-10 left-10 w-[420px] h-[420px] bg-primary opacity-10 blur-[160px] rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-[420px] h-[420px] bg-secondary opacity-10 blur-[160px] rounded-full"></div>

      <div className="relative w-full max-w-4xl bg-panel/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.5)] p-10 z-10">
        <h2 className="text-3xl font-semibold text-white text-center mb-10 tracking-wide">
          Mi Perfil
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          <div className="flex flex-col items-center gap-4 md:col-span-1">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-bold text-white shadow-xl">
              {usuario?.nombre?.charAt(0).toUpperCase()}
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold text-white">
                {usuario?.nombre}
              </h3>
              <p className="text-gray-400 text-sm">{usuario?.correo}</p>
              <p className="text-primary text-xs mt-1 font-medium">
                Rol: {usuario?.rol}
              </p>
            </div>

            <a
              href="/perfil/cambiar-contrasena"
              className="mt-4 py-2 px-4 text-sm text-white bg-[#1e1f22] hover:bg-[#2a2b2f] rounded-lg border border-slate-700 transition shadow-md"
            >
              Cambiar Contraseña
            </a>
          </div>

          <div className="md:col-span-2 bg-[#1a1b1e] rounded-xl p-8 border border-slate-800 shadow-inner">
            {mensaje && (
              <p className="text-center mb-6 text-sm text-green-400">
                {mensaje}
              </p>
            )}

            <form onSubmit={actualizarPerfil} className="flex flex-col gap-6">
              {/* Nombre */}
              <div className="grid grid-cols-1 gap-2">
                <label className="text-muted text-sm">Nombre completo</label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="
                    w-full px-4 py-3 rounded-lg bg-[#131416]
                    text-white placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-primary
                    border border-slate-800
                    transition
                  "
                />
              </div>

              <div className="grid grid-cols-1 gap-2">
                <label className="text-muted text-sm">Correo electrónico</label>
                <input
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                  className="
                    w-full px-4 py-3 rounded-lg bg-[#131416]
                    text-white placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-primary
                    border border-slate-800
                    transition
                  "
                />
              </div>

              <button
                type="submit"
                className="
                  w-full py-3 rounded-lg text-white font-medium
                  bg-gradient-to-r from-primary to-accent
                  hover:opacity-90 transition shadow-lg mt-4
                "
              >
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
