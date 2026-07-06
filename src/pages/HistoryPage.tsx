import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../context/AuthContext";

import {
  getDriverTrips,
  getPassengerTrips,
} from "../services/tripService";

import type {
  Trip,
  TripStatus,
} from "../types";


type StatusFilter =
  | "ALL"
  | TripStatus;


export default function HistoryPage() {

  const { user } = useAuth();

  const [trips, setTrips] =
    useState<Trip[]>([]);

  const [filter, setFilter] =
    useState<StatusFilter>("ALL");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const loadHistory = async () => {

      if (!user) {
        return;
      }


      try {

        setError("");


        const data =
          user.role === "PASSENGER"
            ? await getPassengerTrips()
            : await getDriverTrips();


        const sortedTrips = [...data].sort(
          (a, b) =>
            new Date(b.requestedAt).getTime() -
            new Date(a.requestedAt).getTime()
        );


        setTrips(sortedTrips);


      } catch (err) {

        if (axios.isAxiosError(err)) {

          setError(
            err.response?.data?.error ??
              "No se pudo cargar el historial."
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


    loadHistory();

  }, [user]);


  const filteredTrips = trips.filter(
    (trip) =>
      filter === "ALL" ||
      trip.status === filter
  );


  const getDetailPath = (
    tripId: number
  ) => {

    if (user?.role === "PASSENGER") {

      return `/passenger/trips/${tripId}`;

    }

    return `/driver/trips/${tripId}`;

  };


  const getDashboardPath = () => {

    if (user?.role === "PASSENGER") {

      return "/passenger";

    }

    return "/driver";

  };


  if (loading) {

    return (
      <main className="p-6">
        <p>Cargando historial...</p>
      </main>
    );

  }


  return (

    <main className="min-h-screen p-6">

      <section className="mx-auto max-w-6xl space-y-6">


        <header>

          <Link
            to={getDashboardPath()}
            className="text-sm underline"
          >
            ← Volver al dashboard
          </Link>


          <h1 className="mt-3 text-3xl font-bold">
            Historial de viajes
          </h1>


          <p className="text-gray-600">

            {user?.role === "PASSENGER"
              ? "Consulta todos tus viajes como pasajero."
              : "Consulta todos tus viajes como conductor."}

          </p>

        </header>


        {error && (

          <p className="rounded-xl bg-red-100 p-3 text-red-700">
            {error}
          </p>

        )}


        <section className="rounded-2xl border p-5">

          <label
            htmlFor="statusFilter"
            className="font-medium"
          >
            Filtrar por estado
          </label>


          <select
            id="statusFilter"
            value={filter}
            onChange={(event) =>
              setFilter(
                event.target.value as StatusFilter
              )
            }
            className="ml-3 rounded-xl border px-3 py-2"
          >

            <option value="ALL">
              Todos
            </option>

            <option value="PENDING">
              Pendientes
            </option>

            <option value="IN_PROGRESS">
              En progreso
            </option>

            <option value="COMPLETED">
              Completados
            </option>

          </select>

        </section>


        <section className="overflow-x-auto rounded-2xl border">

          {filteredTrips.length === 0 ? (

            <p className="p-5">
              No hay viajes para este filtro.
            </p>

          ) : (

            <table className="w-full border-collapse">

              <thead>

                <tr className="border-b text-left">

                  <th className="p-4">
                    ID
                  </th>

                  <th className="p-4">
                    Origen
                  </th>

                  <th className="p-4">
                    Destino
                  </th>

                  <th className="p-4">
                    Estado
                  </th>

                  <th className="p-4">
                    Fecha
                  </th>

                  <th className="p-4">
                    Acción
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredTrips.map((trip) => (

                  <tr
                    key={trip.id}
                    className="border-b"
                  >

                    <td className="p-4">
                      #{trip.id}
                    </td>


                    <td className="p-4">
                      {trip.pickupAddress}
                    </td>


                    <td className="p-4">
                      {trip.dropoffAddress}
                    </td>


                    <td className="p-4">
                      {trip.status}
                    </td>


                    <td className="p-4">

                      {new Date(
                        trip.requestedAt
                      ).toLocaleString()}

                    </td>


                    <td className="p-4">

                      <Link
                        to={getDetailPath(trip.id)}
                        className="underline"
                      >
                        Ver detalle
                      </Link>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </section>

      </section>

    </main>

  );
}