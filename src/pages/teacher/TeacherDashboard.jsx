import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { api } from "../../api/axios";
import { Link } from "react-router-dom";

export default function TeacherDashboard() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/courses/mine").then((res) => setCourses(res.data.data || []));
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setMessage("");
    const res = await api.post("/courses", { title, description });
    setCourses((prev) => [...prev, res.data.data]);
    setTitle("");
    setDescription("");
    setMessage("Curso creado.");
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Mis cursos (docente)</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="font-semibold mb-2">Listado</h2>
          {courses.length === 0 ? (
            <p className="text-xs text-slate-500">Aún no has creado cursos.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              {courses.map((c) => (
                <div
                  key={c.id}
                  className="card text-sm flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-semibold">{c.title}</h3>
                    <p className="text-xs text-slate-600">
                      {c.description || "Sin descripción"}
                    </p>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <span
                      className={c.isPublished ? "badge-green" : "badge-yellow"}
                    >
                      {c.isPublished ? "Publicado" : "Borrador"}
                    </span>
                    <Link
                      to={`/teacher/courses/${c.id}`}
                      className="btn-primary text-xs"
                    >
                      Administrar
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-semibold mb-2">Crear nuevo curso</h2>
          <form onSubmit={handleCreateCourse} className="card space-y-2">
            <div>
              <label className="text-xs block mb-1">Título</label>
              <input
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs block mb-1">Descripción</label>
              <textarea
                className="input h-20"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button className="btn-primary w-full" type="submit">
              Crear
            </button>
            {message && <p className="text-[11px] text-green-700">{message}</p>}
          </form>
        </div>
      </div>
    </Layout>
  );
}
