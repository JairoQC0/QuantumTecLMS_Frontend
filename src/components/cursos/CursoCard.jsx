export const CursoCard = ({ curso, children }) => {
  return (
    <div
      className="
        bg-[#1a1a1d] border border-slate-800 
        p-6 rounded-xl shadow-lg
        hover:border-primary/40 hover:shadow-primary/10 
        transition group
      "
    >
      <h2 className="text-xl text-white font-semibold group-hover:text-primary transition">
        {curso.titulo}
      </h2>

      <p className="text-gray-400 text-sm mt-2 min-h-[50px]">
        {curso.descripcion || "Sin descripción"}
      </p>

      <div className="flex justify-between items-center mt-4">
        <span
          className={`text-xs px-3 py-1 rounded-full 
            ${
              curso.activo
                ? "bg-primary/20 text-primary"
                : "bg-red-500/20 text-red-400"
            }
          `}
        >
          {curso.activo ? "Activo" : "Inactivo"}
        </span>

        {children}
      </div>
    </div>
  );
};
