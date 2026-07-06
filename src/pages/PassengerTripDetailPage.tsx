import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import {
  getTripById,
  rateTrip,
} from "../services/tripService";

import type { Trip } from "../types";


export default function PassengerTripDetailPage() {
  const { id } = useParams();

  const [trip, setTrip] = useState<Trip | null>(null);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [ratingLoading, setRatingLoading] = useState(false);

  const [error, setError] = useState("");
  const [ratingError, setRatingError] = useState("");


  useEffect(() => {
    if (!id) {
      setError("ID de viaje inválido.");
      setLoading(false);
      return;
    }


    let timeoutId: number | undefined;
    let cancelled = false;


    const loadTrip = async () => {
      try {
        const data = await getTripById(id);

        if (cancelled) {
          return;
        }

        setTrip(data);
        setError("");


        const shouldPoll =
          data.status === "PENDING" ||
          data.status === "IN_PROGRESS";


        if (shouldPoll) {
          timeoutId = window.setTimeout(
            loadTrip,
            4000
          );
        }

      } catch (err) {
        if (cancelled) {
          return;
        }


        if (axios.isAxiosError(err)) {
          if (err.response?.status === 403) {
            setError(
              "No tienes permiso para ver este viaje."
            );

          } else if (err.response?.status === 404) {
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
        if (!cancelled) {
          setLoading(false);
        }
      }
    };


    loadTrip();


    return () => {
      cancelled = true;

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };

  }, [id]);


  const handleRate = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!id) {
      return;
    }

    setRatingError("");
    setRatingLoading(true);


    try {
      const updatedTrip = await rateTrip(id, {
        rating,
        comment: comment.trim() || undefined,
      });

      setTrip(updatedTrip);

    } catch (err) {
      if (axios.isAxiosError(err)) {
        setRatingError(
          err.response?.data?.error ??
            "No se pudo enviar la calificación."
        );

      } else {
        setRatingError(
          "Ocurrió un error inesperado."
        );
      }

    } finally {
      setRatingLoading(false);
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

        <Link to="/passenger">
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
            to="/passenger"
            className="text-sm underline"
          >
            ← Volver
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

          <div className="space-y-4">

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


            <div>
              <p className="text-sm text-gray-500">
                Conductor
              </p>

              {trip.driver ? (
                <div>
                  <p className="font-medium">
                    {trip.driver.firstName}{" "}
                    {trip.driver.lastName}
                  </p>

                  <p className="text-sm text-gray-600">
                    Rating:{" "}
                    {trip.driver.rating.toFixed(1)}
                  </p>
                </div>

              ) : (
                <p className="font-medium">
                  Buscando conductor...
                </p>
              )}
            </div>


            <div>
              <p className="text-sm text-gray-500">
                Solicitado
              </p>

              <p>
                {new Date(
                  trip.requestedAt
                ).toLocaleString()}
              </p>
            </div>


            {trip.acceptedAt && (
              <div>
                <p className="text-sm text-gray-500">
                  Aceptado
                </p>

                <p>
                  {new Date(
                    trip.acceptedAt
                  ).toLocaleString()}
                </p>
              </div>
            )}


            {trip.completedAt && (
              <div>
                <p className="text-sm text-gray-500">
                  Completado
                </p>

                <p>
                  {new Date(
                    trip.completedAt
                  ).toLocaleString()}
                </p>
              </div>
            )}

          </div>
        </section>


        {trip.status === "COMPLETED" &&
          trip.passengerRating === null && (

            <section className="rounded-2xl border p-5 shadow-sm">

              <h2 className="text-xl font-semibold">
                Calificar viaje
              </h2>


              <form
                onSubmit={handleRate}
                className="mt-4 space-y-4"
              >

                <fieldset>
                  <legend className="font-medium">
                    Calificación
                  </legend>


                  <div className="mt-2 flex gap-2">

                    {[1, 2, 3, 4, 5].map(
                      (value) => (

                        <button
                          key={value}
                          type="button"
                          onClick={() =>
                            setRating(value)
                          }
                          className="text-2xl"
                          aria-label={`${value} estrellas`}
                        >
                          {value <= rating
                            ? "★"
                            : "☆"}
                        </button>

                      )
                    )}

                  </div>
                </fieldset>


                <div>
                  <label
                    htmlFor="comment"
                    className="font-medium"
                  >
                    Comentario opcional
                  </label>

                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(event) =>
                      setComment(event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border p-3"
                    rows={4}
                  />
                </div>


                {ratingError && (
                  <p className="text-red-600">
                    {ratingError}
                  </p>
                )}


                <button
                  type="submit"
                  disabled={ratingLoading}
                  className="rounded-xl bg-black px-4 py-2 text-white"
                >
                  {ratingLoading
                    ? "Enviando..."
                    : "Enviar calificación"}
                </button>

              </form>

            </section>
          )}


        {trip.passengerRating !== null && (

          <section className="rounded-2xl border p-5">

            <h2 className="font-semibold">
              Tu calificación
            </h2>

            <p>
              {"★".repeat(trip.passengerRating)}
            </p>

            {trip.ratingComment && (
              <p>{trip.ratingComment}</p>
            )}

          </section>
        )}

      </section>
    </main>
  );
}