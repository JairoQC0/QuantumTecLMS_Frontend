import { useEffect, useState } from "react";
import { api } from "../../api/axios";

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.get("/enrollments/mine").then((res) => setCourses(res.data.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Mis cursos</h1>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {courses.map((c) => (
          <div key={c.id} className="p-4 bg-white shadow rounded">
            <h2 className="font-semibold">{c.course.title}</h2>
            <p className="text-sm">{c.course.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
