import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { api } from "../../api/axios";

export default function StudentCourseDetail() {
  const { id } = useParams();
  const courseId = Number(id);
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/courses/${courseId}`),
      api.get(`/content/course/${courseId}/modules`),
      api.get(`/assignments/course/${courseId}`),
    ])
      .then(([c, m, a]) => {
        setCourse(c.data.data);
        setModules(m.data.data || []);
        setAssignments(a.data.data || []);
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  const handleSubmitAssignment = async (assignmentId) => {
    const content = prompt("Escribe tu respuesta (texto simple):");
    if (!content) return;
    await api.post(`/assignments/${assignmentId}/submit`, { content });
    setMessage("Entrega registrada.");
  };

  if (loading) {
    return (
      <Layout>
        <p>Cargando...</p>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <p>Curso no encontrado.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-1">{course.title}</h1>
      <p className="text-sm text-slate-600 mb-4">
        {course.description || "Sin descripción"}
      </p>
      {message && <p className="text-xs text-green-700 mb-3">{message}</p>}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Contenido */}
        <div className="md:col-span-2">
          <h2 className="font-semibold mb-2">Contenido del curso</h2>
          {modules.length === 0 ? (
            <p className="text-xs text-slate-500">Sin módulos aún.</p>
          ) : (
            <div className="space-y-3">
              {modules.map((mod) => (
                <div key={mod.id} className="card">
                  <h3 className="font-semibold text-sm mb-1">
                    {mod.order}. {mod.title}
                  </h3>
                  <ul className="list-disc ml-5 text-xs text-slate-700">
                    {mod.lessons.map((l) => (
                      <li key={l.id}>
                        <span className="font-medium">{l.title}:</span>{" "}
                        {l.content?.slice(0, 80) || "Sin contenido"}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tareas */}
        <div>
          <h2 className="font-semibold mb-2">Tareas</h2>
          {assignments.length === 0 ? (
            <p className="text-xs text-slate-500">No hay tareas asignadas.</p>
          ) : (
            <div className="space-y-3">
              {assignments.map((a) => (
                <div key={a.id} className="card text-xs">
                  <h3 className="font-semibold">{a.title}</h3>
                  <p className="text-slate-600 mb-1">
                    {a.description || "Sin descripción"}
                  </p>
                  {a.dueDate && (
                    <p className="text-[11px] text-slate-500">
                      Entrega hasta: {new Date(a.dueDate).toLocaleString()}
                    </p>
                  )}
                  <button
                    className="btn-primary mt-2 w-full"
                    onClick={() => handleSubmitAssignment(a.id)}
                  >
                    Enviar respuesta
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
