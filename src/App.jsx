import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentCourseDetail from "./pages/student/StudentCourseDetail";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherCourseDetail from "./pages/teacher/TeacherCourseDetail";
import AdminUsers from "./pages/admin/AdminUsers";
import CoursePublicDetail from "./pages/CoursePublicDetail";
import { PrivateRoute } from "./router";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Público */}
        <Route path="/" element={<Home />} />
        <Route path="/courses/:id" element={<CoursePublicDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Estudiante */}
        <Route
          path="/student"
          element={
            <PrivateRoute roles={["STUDENT"]}>
              <StudentDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/courses/:id"
          element={
            <PrivateRoute roles={["STUDENT"]}>
              <StudentCourseDetail />
            </PrivateRoute>
          }
        />

        {/* Docente */}
        <Route
          path="/teacher"
          element={
            <PrivateRoute roles={["TEACHER"]}>
              <TeacherDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/courses/:id"
          element={
            <PrivateRoute roles={["TEACHER"]}>
              <TeacherCourseDetail />
            </PrivateRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin/users"
          element={
            <PrivateRoute roles={["ADMIN"]}>
              <AdminUsers />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
