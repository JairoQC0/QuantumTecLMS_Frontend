import { useState, useContext } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError("Credenciales inválidas o error de servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="card w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4 text-center">Iniciar sesión</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs block mb-1">Correo</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div>
            <label className="text-xs block mb-1">Contraseña</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>
        <p className="text-xs mt-3 text-center">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-blue-600 underline">
            Registrarse
          </Link>
        </p>
      </div>
    </div>
  );
}
