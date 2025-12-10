import { useEffect, useState } from "react";
import { api } from "../../api/axios";
import Layout from "../../components/Layout";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.get("/enrollments/mine").then((res) => {
      setCourses(res.data.data || []);
    });
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Mis cursos</h1>
      {courses.length === 0 ? (
        <p className="text-sm text-slate-500">
          Aún no estás inscrito en ningún curso.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {courses.map((e) => (
            <div key={e.id} className="card">
              <h2 className="font-semibold mb-1">{e.course.title}</h2>
              <p className="text-xs text-slate-600">
                {e.course.description || "Sin descripción"}
              </p>
              <div className="mt-3 flex justify-between items-center">
                <span className="badge-green">Inscrito</span>
                <Link
                  to={`/student/courses/${e.course.id}`}
                  className="btn-primary text-xs"
                >
                  Ir al curso
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
