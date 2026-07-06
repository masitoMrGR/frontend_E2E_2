import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import {
  completeTrip,
  getTripById,
} from "../services/tripService";

import type { Trip } from "../types";


export default function DriverTripDetailPage() {

  const { id } = useParams();

  const [trip, setTrip] =
    useState<Trip | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [completing, setCompleting] =
    useState(false);

  const [error, setError] =
    useState("");


  useEffect(() => {

    const loadTrip = async () => {

      if (!id) {

        setError("ID de viaje inválido.");
        setLoading(false);

        return;

      }


      try {

        const data = await getTripById(id);

        setTrip(data);


      } catch (err) {

        if (axios.isAxiosError(err)) {

          if (err.response?.status === 403) {

            setError(
              "No tienes permiso para ver este viaje."
            );

          } else if (
            err.response?.status === 404
          ) {

            setError(
              "El viaje no existe."
            );

          } else {

            setError(
              err.response?.data?.error ??
              "No se pudo cargar el viaje."
            );

          }

        } else {

          setError(
            "Ocurrió un error inesperado."
          );

        }

      } finally {

        setLoading(false);

      }

    };


    loadTrip();

  }, [id]);


  const handleComplete = async () => {

    if (!id) {
      return;
    }


    setCompleting(true);
    setError("");


    try {

      const updatedTrip =
        await completeTrip(id);

      setTrip(updatedTrip);


    } catch (err) {

      if (axios.isAxiosError(err)) {

        setError(
          err.response?.data?.error ??
          "No se pudo completar el viaje."
        );

      } else {

        setError(
          "Ocurrió un error inesperado."
        );

      }

    } finally {

      setCompleting(false);

    }

  };


  if (loading) {

    return (
      <main className="p-6">
        <p>Cargando viaje...</p>
      </main>
    );

  }


  if (error && !trip) {

    return (
      <main className="p-6">

        <p className="text-red-600">
          {error}
        </p>

        <Link to="/driver">
          Volver al dashboard
        </Link>

      </main>
    );

  }


  if (!trip) {

    return (
      <main className="p-6">
        <p>No se encontró el viaje.</p>
      </main>
    );

  }


  return (

    <main className="min-h-screen p-6">

      <section className="mx-auto max-w-3xl space-y-6">


        <header>

          <Link
            to="/driver"
            className="text-sm underline"
          >
            ← Volver al dashboard
          </Link>


          <h1 className="mt-3 text-3xl font-bold">
            Viaje #{trip.id}
          </h1>

        </header>


        {error && (

          <p className="rounded-xl bg-red-100 p-3 text-red-700">
            {error}
          </p>

        )}


        <section className="rounded-2xl border p-5 shadow-sm">

          <h2 className="text-xl font-semibold">
            Información del viaje
          </h2>


          <div className="mt-4 space-y-4">


            <div>

              <p className="text-sm text-gray-500">
                Estado
              </p>

              <p className="font-semibold">
                {trip.status}
              </p>

            </div>


            <div>

              <p className="text-sm text-gray-500">
                Origen
              </p>

              <p className="font-medium">
                {trip.pickupAddress}
              </p>

            </div>


            <div>

              <p className="text-sm text-gray-500">
                Destino
              </p>

              <p className="font-medium">
                {trip.dropoffAddress}
              </p>

            </div>

          </div>

        </section>


        <section className="rounded-2xl border p-5 shadow-sm">

          <h2 className="text-xl font-semibold">
            Pasajero
          </h2>


          <div className="mt-4">

            <p className="font-medium">

              {trip.passenger.firstName}
              {" "}
              {trip.passenger.lastName}

            </p>

            <p className="text-sm text-gray-600">
              {trip.passenger.email}
            </p>

          </div>

        </section>


        {trip.status === "IN_PROGRESS" && (

          <section className="rounded-2xl border p-5">

            <h2 className="text-xl font-semibold">
              Viaje en progreso
            </h2>

            <p className="mt-2 text-gray-600">
              Cuando hayas llegado al destino,
              marca el viaje como completado.
            </p>


            <button
              type="button"
              onClick={handleComplete}
              disabled={completing}
              className="mt-4 rounded-xl bg-black px-4 py-2 text-white disabled:opacity-50"
            >

              {completing
                ? "Completando..."
                : "Completar viaje"}

            </button>

          </section>

        )}


        {trip.status === "COMPLETED" && (

          <section className="rounded-2xl border p-5">

            <h2 className="text-xl font-semibold">
              Viaje completado
            </h2>


            <div className="mt-4 space-y-2">

              <p>
                <strong>Origen:</strong>{" "}
                {trip.pickupAddress}
              </p>

              <p>
                <strong>Destino:</strong>{" "}
                {trip.dropoffAddress}
              </p>


              {trip.completedAt && (

                <p>

                  <strong>
                    Completado:
                  </strong>{" "}

                  {new Date(
                    trip.completedAt
                  ).toLocaleString()}

                </p>

              )}


              {trip.passengerRating !== null ? (

                <div>

                  <p>

                    <strong>
                      Calificación:
                    </strong>{" "}

                    {trip.passengerRating}/5

                  </p>


                  {trip.ratingComment && (

                    <p>

                      <strong>
                        Comentario:
                      </strong>{" "}

                      {trip.ratingComment}

                    </p>

                  )}

                </div>

              ) : (

                <p>
                  El pasajero todavía no ha calificado este viaje.
                </p>

              )}

            </div>

          </section>

        )}

      </section>

    </main>

  );
}