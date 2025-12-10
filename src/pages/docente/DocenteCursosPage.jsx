import { useEffect, useState, useContext } from "react";
import { api } from "../../api/api";
import { Users, Pencil, Power, Trash2, Plus } from "lucide-react";
import { AuthContext } from "../../auth/AuthContext";

export const DocenteCursosPage = () => {
  const { usuario } = useContext(AuthContext);

  const [cursos, setCursos] = useState([]);

  const [panel, setPanel] = useState({
    visible: false,
    curso: null,
    inscritos: [],
    solicitudes: [],
  });

  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    id: null,
    titulo: "",
    descripcion: "",
    activo: true,
  });

  const [modalEliminar, setModalEliminar] = useState(false);
  const [cursoAEliminar, setCursoAEliminar] = useState(null);

  const cargarCursos = async () => {
    if (!usuario) return;
    const { data } = await api.get("/cursos/docente/mis-cursos", {
      params: { docenteId: usuario.id },
    });
    setCursos(data.datos || []);
  };

  const verInscritos = async (curso) => {
    try {
      const { data } = await api.get(`/inscripciones/curso/${curso.id}`);
      const panelDatos = data.datos || {};

      setPanel({
        visible: true,
        curso,
        inscritos: panelDatos.inscritos || [],
        solicitudes: panelDatos.solicitudes || [],
      });
    } catch (error) {
      console.error(error);
      setPanel({
        visible: true,
        curso,
        inscritos: [],
        solicitudes: [],
      });
    }
  };

  const cerrarPanel = () => {
    setPanel({ visible: false, curso: null, inscritos: [], solicitudes: [] });
  };

  const abrirCrearCurso = () => {
    setForm({
      id: null,
      titulo: "",
      descripcion: "",
      activo: true,
    });
    setModal(true);
  };

  const abrirEditar = (curso) => {
    setForm({
      id: curso.id,
      titulo: curso.titulo,
      descripcion: curso.descripcion || "",
      activo: curso.activo,
    });
    setModal(true);
  };

  const guardarCurso = async () => {
    if (!usuario) return;

    const payload = {
      titulo: form.titulo,
      descripcion: form.descripcion,
      activo: form.activo,
      docenteId: usuario.id,
    };

    if (form.id) {
      await api.put(`/cursos/${form.id}`, payload);
    } else {
      await api.post("/cursos", payload);
    }

    setModal(false);
    await cargarCursos();
  };

  const pedirEliminar = (curso) => {
    setCursoAEliminar(curso);
    setModalEliminar(true);
  };

  const eliminarCurso = async () => {
    if (!cursoAEliminar) return;
    await api.delete(`/cursos/${cursoAEliminar.id}`);
    setModalEliminar(false);
    setCursoAEliminar(null);
    await cargarCursos();
  };

  const toggleEstado = async (curso) => {
    if (!usuario) return;

    const payload = {
      titulo: curso.titulo,
      descripcion: curso.descripcion,
      activo: !curso.activo,
      docenteId: curso.docenteId || usuario.id,
    };

    await api.put(`/cursos/${curso.id}`, payload);
    await cargarCursos();
  };

  const responderSolicitud = async (solicitudId, accion) => {
    try {
      await api.post(`/inscripciones/solicitudes/${solicitudId}/${accion}`);
      if (panel.curso) {
        const { data } = await api.get(
          `/inscripciones/curso/${panel.curso.id}`
        );
        const panelDatos = data.datos || {};
        setPanel((prev) => ({
          ...prev,
          inscritos: panelDatos.inscritos || [],
          solicitudes: panelDatos.solicitudes || [],
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const load = async () => {
      await cargarCursos();
    };
    load();
  });

  return (
    <div className="min-h-screen bg-dark p-10 md:ml-64 transition-all">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl text-white font-bold">Mis Cursos</h1>

        <button
          onClick={abrirCrearCurso}
          className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} />
          Nuevo Curso
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {cursos.map((curso) => (
          <div
            key={curso.id}
            className="bg-[#141416] border border-slate-700 rounded-xl p-6 shadow-xl hover:scale-[1.01] transition"
          >
            <h2 className="text-xl font-semibold text-white">{curso.titulo}</h2>

            <p className="text-gray-400 text-sm mt-2 min-h-[40px]">
              {curso.descripcion || "Sin descripción"}
            </p>

            <p className="text-xs text-gray-500 mt-2">
              Código de acceso:{" "}
              <span className="font-mono text-primary">
                {curso.codigoAcceso}
              </span>
            </p>

            <span
              className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold
                ${
                  curso.activo
                    ? "bg-green-900/40 text-green-400"
                    : "bg-red-900/40 text-red-400"
                }
              `}
            >
              {curso.activo ? "ACTIVO" : "INACTIVO"}
            </span>

            <div className="flex gap-3 mt-6">
              <button
                className="flex items-center gap-1 bg-primary px-3 py-1 rounded-lg hover:bg-primary/80 text-white"
                onClick={() => verInscritos(curso)}
              >
                <Users size={16} />
                Inscritos
              </button>

              <button
                className="text-blue-400 hover:text-blue-300"
                onClick={() => abrirEditar(curso)}
              >
                <Pencil size={18} />
              </button>

              <button
                className={
                  curso.activo
                    ? "text-yellow-400 hover:text-yellow-300"
                    : "text-green-400 hover:text-green-300"
                }
                onClick={() => toggleEstado(curso)}
              >
                <Power size={18} />
              </button>

              <button
                className="text-red-400 hover:text-red-300"
                onClick={() => pedirEliminar(curso)}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {cursos.length === 0 && (
          <p className="text-gray-400 text-sm col-span-full">
            No tienes cursos registrados.
          </p>
        )}
      </div>

      {panel.visible && (
        <div className="mt-12 bg-[#141416] p-6 rounded-xl border border-slate-700 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-white font-semibold">
              Gestión de curso:{" "}
              <span className="text-primary">{panel.curso.titulo}</span>
            </h2>
            <button
              onClick={cerrarPanel}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {panel.solicitudes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg text-white font-semibold mb-3">
                Solicitudes pendientes
              </h3>
              <ul className="space-y-3">
                {panel.solicitudes.map((s) => (
                  <li
                    key={s.id}
                    className="bg-[#1b1c1f] px-4 py-3 rounded-lg flex justify-between items-center text-gray-300"
                  >
                    <div>
                      <p className="font-medium">{s.nombre}</p>
                      <p className="text-sm text-primary">{s.correo}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => responderSolicitud(s.id, "aceptar")}
                        className="px-3 py-1 rounded-lg text-xs bg-green-700 hover:bg-green-600 text-white"
                      >
                        Aceptar
                      </button>
                      <button
                        onClick={() => responderSolicitud(s.id, "rechazar")}
                        className="px-3 py-1 rounded-lg text-xs bg-red-700 hover:bg-red-600 text-white"
                      >
                        Rechazar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <h3 className="text-lg text-white font-semibold mb-3">
            Estudiantes inscritos
          </h3>

          {panel.inscritos.length === 0 && (
            <p className="text-gray-400 italic">
              No hay estudiantes inscritos.
            </p>
          )}

          <ul className="space-y-3">
            {panel.inscritos.map((i) => (
              <li
                key={i.id}
                className="bg-[#1b1c1f] px-4 py-3 rounded-lg flex justify-between text-gray-300"
              >
                <span>{i.nombre}</span>
                <span className="text-primary">{i.correo}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-[#141416] p-8 rounded-xl border border-slate-700 w-full max-w-lg shadow-2xl relative">
            <button
              onClick={() => setModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <h2 className="text-xl text-white font-semibold mb-6">
              {form.id ? "Editar Curso" : "Crear Curso"}
            </h2>

            <input
              className="w-full mb-4 bg-[#1b1c1f] border border-slate-700 px-4 py-2 rounded-lg text-white"
              placeholder="Título"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            />

            <textarea
              className="w-full mb-4 bg-[#1b1c1f] border border-slate-700 px-4 py-2 rounded-lg text-white min-h-[100px]"
              placeholder="Descripción"
              value={form.descripcion}
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
            />

            {form.id && (
              <label className="flex items-center gap-3 text-white mb-4">
                <input
                  type="checkbox"
                  checked={form.activo}
                  onChange={() =>
                    setForm((prev) => ({ ...prev, activo: !prev.activo }))
                  }
                />
                Activo
              </label>
            )}

            <button
              onClick={guardarCurso}
              className="w-full bg-primary hover:bg-primary/80 text-white py-2 rounded-lg mt-2"
            >
              {form.id ? "Guardar Cambios" : "Crear Curso"}
            </button>
          </div>
        </div>
      )}

      {modalEliminar && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-[#141416] p-8 rounded-xl border border-slate-700 w-full max-w-md shadow-lg">
            <h2 className="text-xl text-white font-semibold mb-4">
              ¿Eliminar curso?
            </h2>
            <p className="text-gray-400 mb-6">
              Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setModalEliminar(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white"
              >
                Cancelar
              </button>
              <button
                onClick={eliminarCurso}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
