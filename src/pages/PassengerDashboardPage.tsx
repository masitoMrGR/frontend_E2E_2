import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

import { useAuth } from "../context/AuthContext";
import { getPassengerTrips } from "../services/tripService";
import type { Trip, TripStatus } from "../types";


const STATUS_LABEL: Record<TripStatus, string> = {
  PENDING: "Pendiente",
  IN_PROGRESS: "En progreso",
  COMPLETED: "Completado",
};

const STATUS_BADGE_CLASS: Record<TripStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
};


function StatusBadge({ status }: { status: TripStatus }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE_CLASS[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}


export default function PassengerDashboardPage() {
  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const loadTrips = async () => {
      try {
        setError("");
        const data = await getPassengerTrips();
        setTrips(data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.error ??
              "No se pudieron cargar tus viajes."
          );
        } else {
          setError("Ocurrió un error inesperado.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, []);


  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  const sortedTrips = [...trips].sort(
    (a, b) =>
      new Date(b.requestedAt).getTime() -
      new Date(a.requestedAt).getTime()
  );


  return (
    <main className="min-h-screen p-6">
      <section className="mx-auto max-w-5xl space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Dashboard pasajero
            </h1>

            <p className="text-gray-600">
              {user?.firstName} {user?.lastName}
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/history"
              className="rounded-xl border px-4 py-2 font-medium"
            >
              Historial
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border px-4 py-2 font-medium"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        {error && (
          <p className="rounded-xl bg-red-100 p-3 text-red-700">
            {error}
          </p>
        )}

        <section className="rounded-2xl border-2 p-5 shadow-sm">
          <h2 className="text-xl font-bold">
            ¿A dónde vamos?
          </h2>

          <p className="mt-1 text-gray-600">
            Pide un viaje y elige entre los conductores disponibles.
          </p>

          <Link
            to="/passenger/request"
            className="mt-4 inline-block rounded-xl bg-black px-4 py-2 text-white"
          >
            Pedir viaje
          </Link>
        </section>

        <section className="rounded-2xl border p-5">
          <h2 className="text-xl font-semibold">
            Mis viajes
          </h2>

          {loading ? (
            <p className="mt-4">Cargando viajes...</p>
          ) : sortedTrips.length === 0 ? (
            <p className="mt-4">
              Todavía no has pedido ningún viaje.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {sortedTrips.map((trip) => (
                <article
                  key={trip.id}
                  className="rounded-xl border p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">
                      {trip.pickupAddress}
                      {" → "}
                      {trip.dropoffAddress}
                    </p>

                    <StatusBadge status={trip.status} />
                  </div>

                  <Link
                    to={`/passenger/trips/${trip.id}`}
                    className="mt-2 inline-block underline"
                  >
                    Ver detalle
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
