import { useEffect, useState, useContext } from "react";
import { api } from "../api/axios";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { AuthContext } from "../auth/AuthProvider";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api.get("/courses/public").then((res) => {
      setCourses(res.data.data || []);
    });
  }, []);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Catálogo de cursos</h1>
      </div>

      {user && (
        <div className="mb-4 text-sm">
          {user.role === "STUDENT" && (
            <span>
              Eres estudiante. Ve a{" "}
              <Link to="/student" className="text-blue-600 underline">
                Mis cursos
              </Link>
            </span>
          )}
          {user.role === "TEACHER" && (
            <span>
              Eres docente. Ve a{" "}
              <Link to="/teacher" className="text-blue-600 underline">
                Mis cursos
              </Link>
            </span>
          )}
          {user.role === "ADMIN" && (
            <span>
              Eres admin. Ve a{" "}
              <Link to="/admin/users" className="text-blue-600 underline">
                Usuarios
              </Link>
            </span>
          )}
        </div>
      )}

      {courses.length === 0 ? (
        <p className="text-sm text-slate-500">No hay cursos publicados aún.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {courses.map((c) => (
            <div key={c.id} className="card flex flex-col justify-between">
              <div>
                <h2 className="font-semibold mb-1">{c.title}</h2>
                <p className="text-xs text-slate-600 mb-2">
                  {c.description || "Sin descripción"}
                </p>
                {c.teacher && (
                  <p className="text-xs text-slate-500">
                    Docente: {c.teacher.name}
                  </p>
                )}
              </div>
              <div className="mt-3">
                <Link
                  to={`/courses/${c.id}`}
                  className="btn-primary inline-block text-center w-full"
                >
                  Ver detalle
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
