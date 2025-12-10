import { useEffect, useState } from "react";
import { api } from "../../api/axios";

export default function TeacherDashboard() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.get("/courses/mine").then((res) => setCourses(res.data.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Cursos creados</h1>
      <button className="btn-primary mt-2">+ Crear curso</button>

      <div className="grid grid-cols-3 gap-4 mt-6">
        {courses.map((c) => (
          <div className="card" key={c.id}>
            <h2>{c.title}</h2>
            <p className="text-xs text-gray-600">{c.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
