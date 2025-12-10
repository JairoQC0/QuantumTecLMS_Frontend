import { useState } from "react";
import { api } from "../../api/api";
import { Lock, CheckCircle2, AlertCircle } from "lucide-react";

export const CambiarContrasenaPage = () => {
  const [form, setForm] = useState({
    actual: "",
    nueva: "",
    confirmar: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMensaje("");
    setError("");

    if (form.nueva !== form.confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      await api.put("/usuarios/me/password", {
        actual: form.actual,
        nueva: form.nueva,
      });

      setMensaje("Contraseña actualizada correctamente.");
      setForm({ actual: "", nueva: "", confirmar: "" });

      setTimeout(() => setMensaje(""), 2500);
    } catch {
      setError("La contraseña actual no es válida.");
    }
  };

  return (
    <div className="min-h-screen bg-dark px-4 py-12 flex justify-center items-start relative overflow-hidden">
      <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-primary opacity-10 blur-[140px] rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-secondary opacity-10 blur-[140px] rounded-full"></div>

      <div className="relative w-full max-w-4xl bg-panel/80 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-[0_0_60px_rgba(0,0,0,0.4)] p-12 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12 items-center">
          <div className="flex justify-center md:justify-start">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-xl">
              <Lock size={48} className="text-white" />
            </div>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-3xl font-semibold text-white tracking-wide mb-2">
              Cambiar contraseña
            </h2>
            <p className="text-gray-400 leading-relaxed max-w-md">
              Actualiza tu contraseña para mantener tu cuenta protegida.
              Asegúrate de usar una clave fuerte que solo tú conozcas.
            </p>
          </div>
        </div>

        {mensaje && (
          <div className="mb-6 flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle2 size={18} /> {mensaje}
          </div>
        )}
        {error && (
          <div className="mb-6 flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="col-span-1">
            <label className="text-muted text-sm mb-1 block">
              Contraseña actual
            </label>
            <input
              type="password"
              name="actual"
              value={form.actual}
              onChange={handleChange}
              className="
                w-full px-4 py-3 rounded-lg bg-[#121315]
                text-white border border-slate-700
                focus:ring-2 focus:ring-primary transition
              "
            />
          </div>

          <div className="col-span-1">
            <label className="text-muted text-sm mb-1 block">
              Nueva contraseña
            </label>
            <input
              type="password"
              name="nueva"
              value={form.nueva}
              onChange={handleChange}
              className="
                w-full px-4 py-3 rounded-lg bg-[#121315]
                text-white border border-slate-700
                focus:ring-2 focus:ring-primary transition
              "
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="text-muted text-sm mb-1 block">
              Confirmar contraseña
            </label>
            <input
              type="password"
              name="confirmar"
              value={form.confirmar}
              onChange={handleChange}
              className="
                w-full px-4 py-3 rounded-lg bg-[#121315]
                text-white border border-slate-700
                focus:ring-2 focus:ring-primary transition
              "
            />
          </div>

          <div className="col-span-1 md:col-span-2 mt-4">
            <button
              type="submit"
              className="
                w-full py-3 rounded-lg text-white font-semibold
                bg-gradient-to-r from-primary to-secondary
                hover:scale-[1.01] active:scale-[0.99]
                transition shadow-lg
              "
            >
              Actualizar contraseña
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
