import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { api } from "../api/axios";
import { AuthContext } from "../auth/AuthProvider";

export default function CoursePublicDetail() {
  const { id } = useParams();
  const courseId = Number(id);
  const [course, setCourse] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api
      .get(`/courses/${courseId}`)
      .then((res) => {
        setCourse(res.data.data);
      })
      .catch(() => {
        setCourse(null);
      });
  }, [courseId]);

  const handleRequest = async () => {
    setMessage("");
    setError("");
    try {
      await api.post("/enrollments/request", { courseId });
      setMessage("Solicitud de inscripción enviada.");
    } catch (err) {
      setError(
        err.response?.data?.message || "No se pudo enviar la solicitud."
      );
    }
  };

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
      <p className="text-sm text-slate-600 mb-2">
        {course.description || "Sin descripción"}
      </p>
      {course.teacher && (
        <p className="text-xs text-slate-500 mb-4">
          Docente: {course.teacher.name}
        </p>
      )}

      {message && <p className="text-xs text-green-700 mb-2">{message}</p>}
      {error && <p className="text-xs text-red-700 mb-2">{error}</p>}

      {user && user.role === "STUDENT" && (
        <button className="btn-primary mb-4" onClick={handleRequest}>
          Solicitar inscripción
        </button>
      )}

      {!user && (
        <p className="text-xs text-slate-500 mb-4">
          Inicia sesión como estudiante para solicitar inscripción.
        </p>
      )}

      <p className="text-xs text-slate-500">
        Cuando el docente acepte tu solicitud, el curso aparecerá en la sección
        "Mis cursos".
      </p>
    </Layout>
  );
}
