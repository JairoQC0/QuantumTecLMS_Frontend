import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { api } from "../../api/axios";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/users").then((res) => setUsers(res.data.data || []));
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Gestión de usuarios (admin)</h1>
      {users.length === 0 ? (
        <p className="text-xs text-slate-500">No hay usuarios.</p>
      ) : (
        <table className="w-full text-xs bg-white border border-slate-200">
          <thead className="bg-slate-100">
            <tr>
              <th className="border px-2 py-1 text-left">ID</th>
              <th className="border px-2 py-1 text-left">Nombre</th>
              <th className="border px-2 py-1 text-left">Correo</th>
              <th className="border px-2 py-1 text-left">Rol</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="border px-2 py-1">{u.id}</td>
                <td className="border px-2 py-1">{u.name}</td>
                <td className="border px-2 py-1">{u.email}</td>
                <td className="border px-2 py-1">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
