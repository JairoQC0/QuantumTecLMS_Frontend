import { useContext, useEffect, useState } from "react";
import { api } from "../../api/api";
import { AuthContext } from "../../auth/AuthContext";

export const EstudianteCursosPage = () => {
  const { usuario } = useContext(AuthContext);

  const [cursos, setCursos] = useState([]);
  const [codigo, setCodigo] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState("info");
  const [cargando, setCargando] = useState(false);

  const cargarCursos = async () => {
    if (!usuario) return;
    try {
      const { data } = await api.get("/inscripciones/mis-cursos", {
        params: { usuarioId: usuario.id },
      });
      setCursos(data.datos || []);
    } catch {
      setMensaje("No se pudieron cargar tus cursos");
      setTipoMensaje("error");
    }
  };

  const solicitarInscripcion = async (e) => {
    e.preventDefault();
    if (!usuario) return;

    if (!codigo.trim()) {
      setMensaje("Ingresa un código de acceso");
      setTipoMensaje("error");
      return;
    }

    setCargando(true);
    setMensaje(null);

    try {
      await api.post("/inscripciones/solicitar", {
        usuarioId: usuario.id,
        codigoAcceso: codigo.trim(),
      });

      setTipoMensaje("success");
      setMensaje("Solicitud enviada correctamente");
      setCodigo("");

      await cargarCursos();
    } catch (error) {
      const msg =
        error.response?.data?.mensaje || "No se pudo enviar la solicitud";
      setTipoMensaje("error");
      setMensaje(msg);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (usuario) {
      cargarCursos();
    }
  });

  return (
    <div className="min-h-screen bg-dark p-10 md:ml-64 transition-all">
      <h1 className="text-3xl text-white font-bold mb-8">Mis Cursos</h1>

      <div className="bg-[#141416] border border-slate-700 rounded-xl p-6 mb-10">
        <h2 className="text-xl text-white font-semibold mb-4">
          Unirme a un curso con código
        </h2>

        <form
          onSubmit={solicitarInscripcion}
          className="flex flex-col sm:flex-row gap-4"
        >
          <input
            className="flex-1 bg-[#1b1c1f] border border-slate-700 px-4 py-2 rounded-lg text-white"
            placeholder="Ej. W6C7A7"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
          />
          <button
            type="submit"
            disabled={cargando}
            className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/80 text-white disabled:opacity-60"
          >
            {cargando ? "Enviando..." : "Enviar solicitud"}
          </button>
        </form>

        {mensaje && (
          <p
            className={`mt-4 text-sm ${
              tipoMensaje === "error"
                ? "text-red-400"
                : tipoMensaje === "success"
                ? "text-green-400"
                : "text-gray-300"
            }`}
          >
            {mensaje}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {cursos.map((curso) => (
          <div
            key={curso.id}
            className="bg-[#141416] border border-slate-700 rounded-xl p-6 shadow-xl"
          >
            <h3 className="text-lg text-white font-semibold">{curso.titulo}</h3>
            <p className="text-gray-400 text-sm mt-2">
              {curso.descripcion || "Sin descripción"}
            </p>
          </div>
        ))}

        {cursos.length === 0 && (
          <p className="text-gray-400 text-sm col-span-full">
            Aún no estás inscrito en ningún curso.
          </p>
        )}
      </div>
    </div>
  );
};
