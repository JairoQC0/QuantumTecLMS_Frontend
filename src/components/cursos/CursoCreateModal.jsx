export const CursoCreateModal = ({ visible, onClose, onSubmit }) => {
  if (!visible) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    onSubmit({
      titulo: form.get("titulo"),
      descripcion: form.get("descripcion"),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-[#1b1c1f] p-6 rounded-xl w-96 border border-slate-700">
        <h2 className="text-xl text-white font-bold mb-4">Crear Curso</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="titulo"
            placeholder="Título del curso"
            className="w-full px-3 py-2 rounded bg-[#141416] text-white border border-slate-700"
            required
          />

          <textarea
            name="descripcion"
            placeholder="Descripción"
            className="w-full px-3 py-2 rounded bg-[#141416] text-white border border-slate-700"
          />

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-600 text-white"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-primary text-white"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
