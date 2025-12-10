import { useState } from "react";

export const CursoEditModal = ({ visible, onClose, curso, onSubmit }) => {
  const [form, setForm] = useState(() => ({
    titulo: curso?.titulo || "",
    descripcion: curso?.descripcion || "",
    activo: curso?.activo ?? true,
  }));

  if (!visible) return null;

  const guardar = () => {
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#18181b] p-6 rounded-xl w-full max-w-md border border-slate-700">
        <h2 className="text-xl text-white font-bold mb-4">Editar Curso</h2>

        {/* Titulo */}
        <label className="text-gray-300 text-sm">Título</label>
        <input
          type="text"
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          className="w-full bg-[#0f0f11] text-white px-3 py-2 rounded-lg border border-slate-700 mb-4"
        />

        {/* Descripcion */}
        <label className="text-gray-300 text-sm">Descripción</label>
        <textarea
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          className="w-full bg-[#0f0f11] text-white px-3 py-2 rounded-lg border border-slate-700 mb-4"
        />

        {/* Estado */}
        <label className="text-gray-300 text-sm">Estado</label>
        <select
          value={form.activo ? "1" : "0"}
          onChange={(e) => setForm({ ...form, activo: e.target.value === "1" })}
          className="w-full bg-[#0f0f11] text-white px-3 py-2 rounded-lg border border-slate-700 mb-4"
        >
          <option value="1">Activo</option>
          <option value="0">Inactivo</option>
        </select>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
          >
            Cancelar
          </button>

          <button
            onClick={guardar}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/80 text-white"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};
