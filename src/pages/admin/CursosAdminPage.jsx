import { useEffect, useState } from "react";
import { api } from "../../api/api";
import { Plus, Pencil, Trash } from "lucide-react";
import { CursoModal } from "../../components/cursos/CursoModal";

export const CursosAdminPage = () => {
  const [cursos, setCursos] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    id: null,
    titulo: "",
    descripcion: "",
    docenteId: "",
    docentes: [],
  });

  const cargarCursos = async () => {
    const { data } = await api.get("/cursos");
    setCursos(data.datos);
  };

  const cargarDocentes = async () => {
    const { data } = await api.get("/usuarios?rol=DOCENTE");
    return data.datos;
  };

  useEffect(() => {
    const fetchCursos = async () => {
      await cargarCursos();
    };
    fetchCursos();
  }, []);

  const abrirCrear = async () => {
    setForm({
      id: null,
      titulo: "",
      descripcion: "",
      docenteId: "",
      docentes: await cargarDocentes(),
    });
    setModal(true);
  };

  const abrirEditar = async (curso) => {
    setForm({
      id: curso.id,
      titulo: curso.titulo,
      descripcion: curso.descripcion,
      docenteId: String(curso.docenteId),
      docentes: await cargarDocentes(),
    });
    setModal(true);
  };

  const guardar = async () => {
    const payload = {
      titulo: form.titulo,
      descripcion: form.descripcion,
      docenteId: Number(form.docenteId),
    };

    if (form.id) {
      await api.put(`/cursos/${form.id}`, payload);
    } else {
      await api.post("/cursos", payload);
    }

    setModal(false);
    cargarCursos();
  };

  const eliminar = async (id) => {
    await api.delete(`/cursos/${id}`);
    cargarCursos();
  };

  const toggleEstado = async (curso) => {
    await api.put(`/cursos/${curso.id}`, {
      activo: !curso.activo,
    });
    cargarCursos();
  };

  return (
    <div className="min-h-screen bg-dark p-10 md:ml-64 transition">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl text-white font-bold">Gestión de Cursos</h1>
        <button
          onClick={abrirCrear}
          className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          <Plus size={18} /> Nuevo Curso
        </button>
      </div>

      {/* Tabla ADMIN */}
      <div className="bg-[#141416] border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#1b1c1f] text-gray-300">
            <tr>
              <th className="px-6 py-3">Título</th>
              <th className="px-6 py-3">Docente</th>
              <th className="px-6 py-3">Descripción</th>
              <th className="px-6 py-3 text-center">Estado</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {cursos.map((curso) => (
              <tr
                key={curso.id}
                className="border-t border-slate-800 hover:bg-[#1a1b1e] transition"
              >
                <td className="px-6 py-4 text-white">{curso.titulo}</td>

                <td className="px-6 py-4 text-primary">
                  {curso.docente?.nombre || "—"}
                </td>

                <td className="px-6 py-4 text-gray-400">
                  {curso.descripcion || "Sin descripción"}
                </td>

                {/* ESTADO */}
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => toggleEstado(curso)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition shadow
                      ${
                        curso.activo
                          ? "bg-green-900/40 text-green-400 hover:bg-green-900/60"
                          : "bg-red-900/40 text-red-400 hover:bg-red-900/60"
                      }
                    `}
                  >
                    {curso.activo ? "ACTIVO" : "INACTIVO"}
                  </button>
                </td>

                {/* ACCIONES */}
                <td className="px-6 py-4 flex justify-center gap-4">
                  <button
                    className="text-blue-400 hover:text-blue-300"
                    onClick={() => abrirEditar(curso)}
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => eliminar(curso.id)}
                  >
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {cursos.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center text-gray-500 py-10 text-sm"
                >
                  No hay cursos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <CursoModal
        visible={modal}
        onClose={() => setModal(false)}
        form={form}
        setForm={setForm}
        onSubmit={guardar}
      />
    </div>
  );
};
