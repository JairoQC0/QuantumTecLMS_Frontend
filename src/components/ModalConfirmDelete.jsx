import React, { useState } from "react";

export const ModalConfirmDelete = ({
  visible,
  onClose,
  onConfirm,
  itemName,
}) => {
  const [texto, setTexto] = useState("");

  if (!visible) return null;

  const puedeEliminar = texto === "DELETE";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#18181b] p-6 rounded-xl w-full max-w-md border border-slate-700">
        <h2 className="text-xl text-white font-bold mb-4">
          ¿Eliminar {itemName}?
        </h2>

        <p className="text-gray-300 mb-4">
          Esta acción <b className="text-red-400">no se puede deshacer.</b>
          <br />
          Para confirmar, escribe{" "}
          <span className="text-red-400 font-bold">DELETE</span>.
        </p>

        <input
          type="text"
          className="w-full bg-[#0f0f11] text-white px-3 py-2 rounded-lg border border-slate-700 focus:outline-none"
          placeholder="Escribe DELETE"
          onChange={(e) => setTexto(e.target.value)}
          value={texto}
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
          >
            Cancelar
          </button>

          <button
            disabled={!puedeEliminar}
            onClick={() => {
              onConfirm();
              setTexto("");
            }}
            className={`px-4 py-2 rounded-lg text-white ${
              puedeEliminar
                ? "bg-red-600 hover:bg-red-500"
                : "bg-red-900 cursor-not-allowed"
            }`}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
