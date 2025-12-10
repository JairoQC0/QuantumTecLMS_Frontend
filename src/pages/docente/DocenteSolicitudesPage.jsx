// src/pages/docente/DocenteSolicitudesPage.jsx
import { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Users, RefreshCw } from "lucide-react";
import { AuthContext } from "../../auth/AuthContext";

const API_URL = "http://localhost:4000/api";

export const DocenteSolicitudesPage = () => {
  const { usuario } = useContext(AuthContext);

  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [accionandoId, setAccionandoId] = useState(null);

  const cargarSolicitudes = useCallback(async () => {
    if (!usuario || usuario.rol !== "DOCENTE") return;

    try {
      setCargando(true);
      setError("");

      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        `${API_URL}/inscripciones/solicitudes/docente`,
        {
          params: { docenteId: usuario.id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSolicitudes(data?.data ?? []);
    } catch (err) {
      console.error("Error cargando solicitudes", err);
      setSolicitudes([]);
      setError("No se pudieron cargar las solicitudes.");
    } finally {
      setCargando(false);
    }
  }, [usuario?.id, usuario?.rol]);

  useEffect(() => {
    cargarSolicitudes();
  }, [cargarSolicitudes]);

  const manejarAccion = async (solicitudId, tipo) => {
    if (!usuario || usuario.rol !== "DOCENTE") return;

    try {
      setAccionandoId(solicitudId);
      setError("");

      const token = localStorage.getItem("token");
      const url =
        tipo === "aceptar"
          ? `${API_URL}/inscripciones/solicitudes/${solicitudId}/aceptar`
          : `${API_URL}/inscripciones/solicitudes/${solicitudId}/rechazar`;

      const { data } = await axios.patch(url, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const nuevoEstado =
        data?.data?.estado || (tipo === "aceptar" ? "ACEPTADA" : "RECHAZADA");

      setSolicitudes((prev) =>
        prev.map((s) =>
          s.id === solicitudId ? { ...s, estado: nuevoEstado } : s
        )
      );
    } catch (err) {
      console.error("Error actualizando solicitud", err);
      setError("No se pudo actualizar la solicitud. Intenta nuevamente.");
    } finally {
      setAccionandoId(null);
    }
  };

  const renderBadgeEstado = (estado) => {
    const e = estado?.toUpperCase();
    if (e === "ACEPTADA") {
      return (
        <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-600/40">
          Aceptada
        </span>
      );
    }
    if (e === "RECHAZADA") {
      return (
        <span className="px-2 py-0.5 rounded-full text-xs bg-red-500/10 text-red-300 border border-red-600/40">
          Rechazada
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-xs bg-amber-500/10 text-amber-300 border border-amber-600/40">
        Pendiente
      </span>
    );
  };

  if (!usuario) {
    return (
      <div className="p-8 text-white">
        Debes iniciar sesión para ver esta sección.
      </div>
    );
  }

  if (usuario.rol !== "DOCENTE") {
    return (
      <div className="p-8 text-white">
        No tienes permisos para ver las solicitudes de ingreso.
      </div>
    );
  }

  return (
    <div className="p-8 text-white bg-[#0b0b0f] min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users size={26} />
            <div>
              <h1 className="text-2xl font-semibold">Solicitudes de ingreso</h1>
              <p className="text-xs text-gray-400">
                Revisa y gestiona las solicitudes de tus cursos.
              </p>
            </div>
          </div>

          <button
            onClick={cargarSolicitudes}
            className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-[#18181c] border border-slate-700 hover:bg-[#222228] transition disabled:opacity-60"
            disabled={cargando}
          >
            <RefreshCw size={16} className={cargando ? "animate-spin" : ""} />
            Recargar
          </button>
        </div>

        {cargando && (
          <div className="bg-[#111116] border border-slate-800 rounded-xl p-4">
            <p className="text-gray-300 text-sm">Cargando solicitudes...</p>
          </div>
        )}

        {!cargando && error && (
          <div className="bg-red-900/20 border border-red-600/40 rounded-xl p-4 mb-4">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {!cargando && !error && solicitudes.length === 0 && (
          <div className="bg-[#111116] border border-slate-800 rounded-xl p-6 text-sm text-gray-300">
            No se encontraron solicitudes de ingreso.
          </div>
        )}

        {!cargando && !error && solicitudes.length > 0 && (
          <div className="space-y-4">
            {solicitudes.map((sol) => {
              const pendiente = sol.estado?.toUpperCase() === "PENDIENTE";
              const deshabilitado = !pendiente || accionandoId === sol.id;

              return (
                <div
                  key={sol.id}
                  className="bg-[#111116] border border-slate-800 rounded-xl p-4 flex justify-between items-center"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm">
                        {sol.curso?.titulo || "Curso sin título"}
                      </p>
                      {renderBadgeEstado(sol.estado)}
                    </div>
                    <p className="text-xs text-gray-400">
                      Estudiante: {sol.estudiante?.nombre} (
                      {sol.estudiante?.correo})
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1">
                      ID solicitud: {sol.id}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => manejarAccion(sol.id, "aceptar")}
                      disabled={deshabilitado}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {accionandoId === sol.id && pendiente
                        ? "Aceptando..."
                        : "Aceptar"}
                    </button>
                    <button
                      onClick={() => manejarAccion(sol.id, "rechazar")}
                      disabled={deshabilitado}
                      className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {accionandoId === sol.id && pendiente
                        ? "Rechazando..."
                        : "Rechazar"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
