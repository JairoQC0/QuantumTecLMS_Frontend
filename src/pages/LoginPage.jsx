import { useContext, useState } from "react";
import { AuthContext } from "../auth/AuthContext";

export const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(correo, contrasena);
      location.href = "/";
    } catch {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] flex justify-center items-center px-4 relative overflow-hidden">
      {/* Fondos decorativos */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-secondary opacity-10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary opacity-10 blur-[130px] rounded-full"></div>

      {/* Contenedor principal */}
      <div className="relative w-full max-w-md bg-[#141416] p-10 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.45)] z-10 backdrop-blur-md">
        <h1 className="text-center text-3xl font-semibold text-white mb-8 tracking-wide">
          Iniciar Sesión
        </h1>

        {error && (
          <p className="text-red-400 text-center mb-4 text-sm">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label className="text-muted text-sm mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="ejemplo@quantumtec.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="
                w-full px-4 py-3 rounded-lg bg-[#1b1c1f]
                text-white placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-primary
                transition-shadow
              "
            />
          </div>

          <div className="flex flex-col">
            <label className="text-muted text-sm mb-1">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="
                w-full px-4 py-3 rounded-lg bg-[#1b1c1f]
                text-white placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-primary
                transition-shadow
              "
            />
          </div>

          {/* Botón principal */}
          <button
            type="submit"
            className="
              w-full py-3 rounded-lg text-white font-semibold
              bg-gradient-to-r from-secondary to-primary
              hover:opacity-90 transition-all shadow-lg
            "
          >
            Ingresar
          </button>
        </form>

        {/* Enlace olvidar */}
        <p className="text-center text-sm text-gray-400 mt-6 hover:text-gray-200 transition cursor-pointer">
          ¿Olvidaste tu contraseña?
        </p>
      </div>
    </div>
  );
};
