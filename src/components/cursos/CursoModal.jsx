import { useEffect, useState } from "react";

export const CursoModal = ({ visible, curso, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    id: null,
    titulo: "",
    descripcion: "",
    activo: true,
    docenteId: null,
  });

  useEffect(() => {
    if (visible && curso) {
      const newForm = {
        id: curso.id || null,
        titulo: curso.titulo || "",
        descripcion: curso.descripcion || "",
        activo: curso.activo ?? true,
        docenteId: curso.docenteId || null,
      };
      setForm(newForm);
    }
  }, [visible, curso]);

  if (!visible) return null;

  const actualizar = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const guardar = () => {
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-[#141416] p-8 rounded-xl border border-slate-700 w-full max-w-lg shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-xl text-white font-semibold mb-6">
          {form.id ? "Editar Curso" : "Crear Nuevo Curso"}
        </h2>

        <div className="flex flex-col gap-4">
          <input
            name="titulo"
            value={form.titulo}
            onChange={actualizar}
            placeholder="Título del curso"
            className="bg-[#1b1c1f] border border-slate-700 text-white px-4 py-2 rounded-lg"
          />

          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={actualizar}
            placeholder="Descripción del curso"
            className="bg-[#1b1c1f] border border-slate-700 text-white px-4 py-2 rounded-lg min-h-[100px]"
          />

          {form.id && (
            <label className="flex items-center gap-3 text-white">
              <input
                type="checkbox"
                checked={form.activo}
                onChange={() => setForm({ ...form, activo: !form.activo })}
              />
              Activo
            </label>
          )}

          <button
            onClick={guardar}
            className="bg-primary hover:bg-primary/80 text-white py-2 rounded-lg transition mt-4"
          >
            {form.id ? "Guardar cambios" : "Crear curso"}
          </button>
        </div>
      </div>
    </div>
  );
};
