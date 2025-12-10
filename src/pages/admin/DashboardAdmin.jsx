import { useEffect, useState } from "react";
import {
  Users,
  Shield,
  GraduationCap,
  UserCog,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import { api } from "../../api/api";

export const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    total: null,
    admins: null,
    docentes: null,
    estudiantes: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/admin/estadisticas");
        setStats(data.datos);
      } catch {
        // Manejo de error
      }
    };

    fetchStats();
  }, []);

  const cardClass =
    "p-6 rounded-xl bg-[#1b1c1f] border border-slate-800 shadow-lg hover:shadow-xl transition hover:-translate-y-1 hover:border-primary/40";

  return (
    <div className="min-h-screen bg-dark p-10 md:ml-64 transition-all">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-white">Panel Administrativo</h1>
        <p className="text-gray-400 mt-2">
          Control general del sistema, gestión de usuarios y métricas globales.
        </p>
      </div>

      <section>
        <h2 className="text-xl font-semibold text-white mb-6">
          Estadísticas Generales
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={cardClass}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-300">Usuarios</h3>
              <Users className="text-primary" size={28} />
            </div>
            <p className="text-3xl font-bold text-white">
              {stats.total ?? "—"}
            </p>
          </div>

          <div className={cardClass}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-300">Administradores</h3>
              <Shield className="text-secondary" size={28} />
            </div>
            <p className="text-3xl font-bold text-white">
              {stats.admins ?? "—"}
            </p>
          </div>

          <div className={cardClass}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-300">Docentes</h3>
              <GraduationCap className="text-accent" size={28} />
            </div>
            <p className="text-3xl font-bold text-white">
              {stats.docentes ?? "—"}
            </p>
          </div>

          <div className={cardClass}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-300">Estudiantes</h3>
              <UserCog className="text-blue-400" size={28} />
            </div>
            <p className="text-3xl font-bold text-white">
              {stats.estudiantes ?? "—"}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-xl font-semibold text-white mb-6">
          Accesos Rápidos
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <a
            href="/admin/usuarios"
            className={`
              ${cardClass} flex items-center justify-between group
            `}
          >
            <div>
              <h3 className="text-white text-lg">Gestión de Usuarios</h3>
              <p className="text-gray-400 text-sm mt-1">
                Administrar cuentas, roles y permisos.
              </p>
            </div>
            <ArrowRight
              size={24}
              className="text-gray-400 group-hover:text-primary transition"
            />
          </a>

          <div className={`${cardClass} flex items-center justify-between`}>
            <div>
              <h3 className="text-white text-lg">Auditoría</h3>
              <p className="text-gray-400 text-sm mt-1">
                Registros de actividad del sistema.
              </p>
            </div>
            <BarChart3 size={24} className="text-secondary" />
          </div>

          <div className={`${cardClass} flex items-center justify-between`}>
            <div>
              <h3 className="text-white text-lg">Configuración</h3>
              <p className="text-gray-400 text-sm mt-1">
                Preferencias generales del sistema.
              </p>
            </div>
            <UserCog size={24} className="text-accent" />
          </div>
        </div>
      </section>
    </div>
  );
};
