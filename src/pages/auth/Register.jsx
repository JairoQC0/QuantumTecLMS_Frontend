import { useState, useContext } from "react";
import { AuthContext } from "../../auth/AuthProvider";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError("No se pudo registrar. Revise los datos.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="card w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4 text-center">Crear cuenta</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs block mb-1">Nombre</label>
            <input
              className="input"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-xs block mb-1">Correo</label>
            <input
              className="input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-xs block mb-1">Contraseña</label>
            <input
              className="input"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-xs block mb-1">Rol</label>
            <select
              className="input"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="STUDENT">Estudiante</option>
              <option value="TEACHER">Docente</option>
            </select>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button className="btn-primary w-full" type="submit">
            Registrarse
          </button>
        </form>
        <p className="text-xs mt-3 text-center">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-blue-600 underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
