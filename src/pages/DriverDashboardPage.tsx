import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import { useAuth } from "../context/AuthContext";

import {
  acceptTrip,
  getDriverTrips,
  getPendingTrips,
} from "../services/tripService";

import type { Trip } from "../types";


export default function DriverDashboardPage() {
  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();


  const [pendingTrips, setPendingTrips] =
    useState<Trip[]>([]);

  const [myTrips, setMyTrips] =
    useState<Trip[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [acceptingId, setAcceptingId] =
    useState<number | null>(null);

  const [error, setError] =
    useState("");


  const activeTrip = myTrips.find(
    (trip) =>
      trip.status === "IN_PROGRESS"
  );


  const completedTrips = myTrips.filter(
    (trip) =>
      trip.status === "COMPLETED"
  );


  const loadDashboard = async () => {
    try {
      setError("");

      const [
        pendingData,
        myTripsData,
      ] = await Promise.all([
        getPendingTrips(),
        getDriverTrips(),
      ]);


      setPendingTrips(pendingData);
      setMyTrips(myTripsData);

    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error ??
            "No se pudieron cargar los viajes."
        );

      } else {
        setError(
          "Ocurrió un error inesperado."
        );
      }

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadDashboard();
  }, []);


  const handleAccept = async (
    tripId: number
  ) => {
    setAcceptingId(tripId);
    setError("");


    try {
      const acceptedTrip =
        await acceptTrip(tripId);


      navigate(
        `/driver/trips/${acceptedTrip.id}`
      );

    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error ??
            "No se pudo aceptar el viaje."
        );

      } else {
        setError(
          "Ocurrió un error inesperado."
        );
      }

    } finally {
      setAcceptingId(null);
    }
  };


  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  return (
    <main className="min-h-screen p-6">

      <section className="mx-auto max-w-5xl space-y-6">

        <header className="flex items-center justify-between gap-4">

          <div>
            <h1 className="text-3xl font-bold">
              Dashboard conductor
            </h1>

            <p className="text-gray-600">
              {user?.firstName}{" "}
              {user?.lastName}
            </p>

            <p className="font-medium">
              Rating:{" "}
              {user?.rating.toFixed(1)}
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


        {loading ? (
          <p>Cargando viajes...</p>

        ) : (
          <>

            {activeTrip && (

              <section className="rounded-2xl border-2 p-5 shadow-sm">

                <p className="text-sm font-semibold">
                  VIAJE ACTIVO
                </p>


                <h2 className="mt-2 text-xl font-bold">
                  {activeTrip.pickupAddress}
                  {" → "}
                  {activeTrip.dropoffAddress}
                </h2>


                <p className="mt-2">
                  Pasajero:{" "}
                  {activeTrip.passenger.firstName}
                  {" "}
                  {activeTrip.passenger.lastName}
                </p>


                <Link
                  to={`/driver/trips/${activeTrip.id}`}
                  className="mt-4 inline-block rounded-xl bg-black px-4 py-2 text-white"
                >
                  Ver viaje activo
                </Link>

              </section>
            )}


            <section className="rounded-2xl border p-5">

              <h2 className="text-xl font-semibold">
                Viajes disponibles
              </h2>


              {pendingTrips.length === 0 ? (
                <p className="mt-4">
                  No hay viajes pendientes.
                </p>

              ) : (

                <div className="mt-4 space-y-3">

                  {pendingTrips.map((trip) => (

                    <article
                      key={trip.id}
                      className="rounded-xl border p-4"
                    >

                      <p className="font-medium">
                        {trip.pickupAddress}
                        {" → "}
                        {trip.dropoffAddress}
                      </p>


                      <p className="text-sm text-gray-600">
                        Pasajero:{" "}
                        {trip.passenger.firstName}
                        {" "}
                        {trip.passenger.lastName}
                      </p>


                      <button
                        type="button"
                        disabled={
                          acceptingId === trip.id ||
                          Boolean(activeTrip)
                        }
                        onClick={() =>
                          handleAccept(trip.id)
                        }
                        className="mt-3 rounded-xl bg-black px-4 py-2 text-white disabled:opacity-50"
                      >
                        {acceptingId === trip.id
                          ? "Aceptando..."
                          : "Aceptar"}
                      </button>

                    </article>
                  ))}

                </div>
              )}

            </section>


            <section className="rounded-2xl border p-5">

              <h2 className="text-xl font-semibold">
                Historial completado
              </h2>


              {completedTrips.length === 0 ? (
                <p className="mt-4">
                  Todavía no tienes viajes completados.
                </p>

              ) : (

                <div className="mt-4 space-y-3">

                  {completedTrips.map((trip) => (

                    <article
                      key={trip.id}
                      className="rounded-xl border p-4"
                    >

                      <p className="font-medium">
                        {trip.pickupAddress}
                        {" → "}
                        {trip.dropoffAddress}
                      </p>


                      <Link
                        to={`/driver/trips/${trip.id}`}
                        className="mt-2 inline-block underline"
                      >
                        Ver detalle
                      </Link>

                    </article>
                  ))}

                </div>
              )}

            </section>

          </>
        )}

      </section>

    </main>
  );
}