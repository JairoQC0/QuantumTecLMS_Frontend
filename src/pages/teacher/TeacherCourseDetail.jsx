import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { api } from "../../api/axios";

export default function TeacherCourseDetail() {
  const { id } = useParams();
  const courseId = Number(id);

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [requests, setRequests] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [tab, setTab] = useState("content"); // content | enrollments | assignments

  // formularios
  const [moduleTitle, setModuleTitle] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [lessonModuleId, setLessonModuleId] = useState(null);

  const [assTitle, setAssTitle] = useState("");
  const [assDesc, setAssDesc] = useState("");
  const [assDue, setAssDue] = useState("");

  const loadAll = () => {
    Promise.all([
      api.get(`/courses/${courseId}`),
      api.get(`/content/course/${courseId}/modules`),
      api.get(`/enrollments/course/${courseId}/requests`),
      api.get(`/assignments/course/${courseId}`),
    ]).then(([c, m, r, a]) => {
      setCourse(c.data.data);
      setModules(m.data.data || []);
      setRequests(r.data.data || []);
      setAssignments(a.data.data || []);
    });
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const handleAddModule = async (e) => {
    e.preventDefault();
    const res = await api.post(`/content/course/${courseId}/modules`, {
      title: moduleTitle,
    });
    setModules((prev) => [...prev, res.data.data]);
    setModuleTitle("");
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!lessonModuleId) return;
    const res = await api.post(`/content/modules/${lessonModuleId}/lessons`, {
      title: lessonTitle,
      content: lessonContent,
    });
    // recargar módulos
    const m = await api.get(`/content/course/${courseId}/modules`);
    setModules(m.data.data || []);
    setLessonTitle("");
    setLessonContent("");
    setLessonModuleId(null);
  };

  const handleApprove = async (enrollmentId) => {
    await api.post(`/enrollments/${enrollmentId}/approve`);
    loadAll();
  };

  const handleReject = async (enrollmentId) => {
    await api.post(`/enrollments/${enrollmentId}/reject`);
    loadAll();
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    const payload = {
      title: assTitle,
      description: assDesc,
      dueDate: assDue || null,
    };
    const res = await api.post(`/assignments/course/${courseId}`, payload);
    setAssignments((prev) => [res.data.data, ...prev]);
    setAssTitle("");
    setAssDesc("");
    setAssDue("");
  };

  const handleGradeSubmission = async (submissionId) => {
    const grade = prompt("Nota (0-20):");
    if (!grade) return;
    await api.post(`/assignments/submissions/${submissionId}/grade`, {
      grade: Number(grade),
    });
    alert("Calificación registrada.");
  };

  if (!course) {
    return (
      <Layout>
        <p>Cargando curso...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-1">{course.title}</h1>
      <p className="text-sm text-slate-600 mb-4">
        {course.description || "Sin descripción"}
      </p>

      <div className="flex gap-2 mb-4 text-sm">
        <button
          onClick={() => setTab("content")}
          className={`px-3 py-1 rounded ${
            tab === "content" ? "bg-slate-900 text-white" : "bg-slate-200"
          }`}
        >
          Contenido
        </button>
        <button
          onClick={() => setTab("enrollments")}
          className={`px-3 py-1 rounded ${
            tab === "enrollments" ? "bg-slate-900 text-white" : "bg-slate-200"
          }`}
        >
          Inscripciones
        </button>
        <button
          onClick={() => setTab("assignments")}
          className={`px-3 py-1 rounded ${
            tab === "assignments" ? "bg-slate-900 text-white" : "bg-slate-200"
          }`}
        >
          Tareas
        </button>
      </div>

      {tab === "content" && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* módulos */}
          <div className="md:col-span-2">
            <h2 className="font-semibold mb-2">Módulos y lecciones</h2>
            {modules.length === 0 ? (
              <p className="text-xs text-slate-500">No hay módulos aún.</p>
            ) : (
              <div className="space-y-3">
                {modules.map((m) => (
                  <div key={m.id} className="card text-xs">
                    <h3 className="font-semibold mb-1">
                      {m.order}. {m.title}
                    </h3>
                    <ul className="list-disc ml-5">
                      {m.lessons.map((l) => (
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

          {/* formularios */}
          <div className="space-y-4">
            <div className="card">
              <h3 className="font-semibold text-sm mb-2">Añadir módulo</h3>
              <form onSubmit={handleAddModule} className="space-y-2 text-xs">
                <input
                  className="input"
                  placeholder="Título del módulo"
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                />
                <button className="btn-primary w-full" type="submit">
                  Crear módulo
                </button>
              </form>
            </div>

            <div className="card">
              <h3 className="font-semibold text-sm mb-2">Añadir lección</h3>
              <form onSubmit={handleAddLesson} className="space-y-2 text-xs">
                <select
                  className="input"
                  value={lessonModuleId || ""}
                  onChange={(e) =>
                    setLessonModuleId(Number(e.target.value) || null)
                  }
                >
                  <option value="">Selecciona módulo</option>
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.order}. {m.title}
                    </option>
                  ))}
                </select>
                <input
                  className="input"
                  placeholder="Título de la lección"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                />
                <textarea
                  className="input h-24"
                  placeholder="Contenido (texto)"
                  value={lessonContent}
                  onChange={(e) => setLessonContent(e.target.value)}
                />
                <button className="btn-primary w-full" type="submit">
                  Crear lección
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {tab === "enrollments" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-semibold mb-2">Solicitudes pendientes</h2>
            {requests.length === 0 ? (
              <p className="text-xs text-slate-500">
                No hay solicitudes pendientes.
              </p>
            ) : (
              <div className="space-y-2">
                {requests.map((r) => (
                  <div
                    key={r.id}
                    className="card text-xs flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">
                        {r.student.name} ({r.student.email})
                      </p>
                      <p className="text-slate-500">
                        Estado: <span className="badge-yellow">{r.status}</span>
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        className="btn-primary"
                        onClick={() => handleApprove(r.id)}
                      >
                        Aceptar
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={() => handleReject(r.id)}
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-xs text-slate-500">
              Las inscripciones aprobadas aparecen como cursos activos en el
              panel del estudiante. Aquí solo gestionas las solicitudes
              pendientes.
            </p>
          </div>
        </div>
      )}

      {tab === "assignments" && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="font-semibold mb-2">Tareas del curso</h2>
            {assignments.length === 0 ? (
              <p className="text-xs text-slate-500">No hay tareas.</p>
            ) : (
              <div className="space-y-3">
                {assignments.map((a) => (
                  <AssignmentCard
                    key={a.id}
                    assignment={a}
                    onGrade={handleGradeSubmission}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-sm">Crear nueva tarea</h3>
            <form
              onSubmit={handleCreateAssignment}
              className="card space-y-2 text-xs"
            >
              <input
                className="input"
                placeholder="Título"
                value={assTitle}
                onChange={(e) => setAssTitle(e.target.value)}
              />
              <textarea
                className="input h-20"
                placeholder="Descripción"
                value={assDesc}
                onChange={(e) => setAssDesc(e.target.value)}
              />
              <input
                className="input"
                type="datetime-local"
                value={assDue}
                onChange={(e) => setAssDue(e.target.value)}
              />
              <button className="btn-primary w-full" type="submit">
                Crear tarea
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

function AssignmentCard({ assignment, onGrade }) {
  const [submissions, setSubmissions] = useState([]);
  const [open, setOpen] = useState(false);

  const loadSubmissions = async () => {
    const res = await api.get(`/assignments/${assignment.id}/submissions`);
    setSubmissions(res.data.data || []);
  };

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) loadSubmissions();
  };

  return (
    <div className="card text-xs">
      <div className="flex justify-between items-center mb-1">
        <div>
          <h3 className="font-semibold">{assignment.title}</h3>
          {assignment.dueDate && (
            <p className="text-[11px] text-slate-500">
              Hasta: {new Date(assignment.dueDate).toLocaleString()}
            </p>
          )}
        </div>
        <button className="btn-secondary" onClick={toggle}>
          {open ? "Ocultar" : "Ver entregas"}
        </button>
      </div>
      <p className="text-slate-600 mb-2">
        {assignment.description || "Sin descripción"}
      </p>
      {open && (
        <div className="border-t border-slate-200 pt-2 space-y-1">
          {submissions.length === 0 ? (
            <p className="text-[11px] text-slate-500">Sin entregas todavía.</p>
          ) : (
            submissions.map((s) => (
              <div key={s.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {s.student.name} ({s.student.email})
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Enviado: {new Date(s.submittedAt).toLocaleString()}
                  </p>
                  <p className="text-[11px]">
                    Nota:{" "}
                    {s.grade == null ? (
                      <span className="badge-yellow">Sin calificar</span>
                    ) : (
                      <span className="badge-green">{s.grade}</span>
                    )}
                  </p>
                </div>
                <button className="btn-primary" onClick={() => onGrade(s.id)}>
                  Calificar
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
