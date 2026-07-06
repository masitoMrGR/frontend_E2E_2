import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { createTrip, getAvailableDrivers } from "../services/tripService";
import type { User } from "../types";

export default function RequestTripPage() {
  const navigate = useNavigate();

  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");

  const [drivers, setDrivers] = useState<User[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDrivers = async () => {
      try {
        setError("");
        const data = await getAvailableDrivers();
        setDrivers(data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.error ??
              "No se pudieron cargar los conductores disponibles."
          );
        } else {
          setError("Ocurrió un error inesperado.");
        }
      } finally {
        setLoadingDrivers(false);
      }
    };

    loadDrivers();
  }, []);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const trip = await createTrip({
        pickupAddress,
        dropoffAddress,
      });

      navigate(`/passenger/trips/${trip.id}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const responseData = err.response?.data;

        if (responseData?.error) {
          setError(responseData.error);
        } else if (responseData) {
          const firstMessage = Object.values(responseData)[0];
          setError(
            typeof firstMessage === "string"
              ? firstMessage
              : "No se pudo crear el viaje."
          );
        } else {
          setError("No se pudo crear el viaje.");
        }
      } else {
        setError("Ocurrió un error inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6">
      <section className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        <div className="rounded-2xl border p-5 shadow-sm">
          <h1 className="text-3xl font-bold">Solicitar viaje</h1>
          <p className="mt-2 text-sm text-gray-600">
            Revisa los conductores disponibles y luego confirma tu viaje.
          </p>

          {error && (
            <p className="mt-4 rounded-xl bg-red-100 px-4 py-3 text-red-700">
              {error}
            </p>
          )}

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="pickupAddress" className="font-medium">
                Origen
              </label>
              <input
                id="pickupAddress"
                type="text"
                className="w-full rounded-xl border px-4 py-2 outline-none"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="Av. Javier Prado 100"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="dropoffAddress" className="font-medium">
                Destino
              </label>
              <input
                id="dropoffAddress"
                type="text"
                className="w-full rounded-xl border px-4 py-2 outline-none"
                value={dropoffAddress}
                onChange={(e) => setDropoffAddress(e.target.value)}
                placeholder="Miraflores, Lima"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-black px-4 py-2 font-medium text-white disabled:opacity-60"
            >
              {loading ? "Creando viaje..." : "Confirmar viaje"}
            </button>
          </form>
        </div>

        <aside className="rounded-2xl border p-5 shadow-sm">
          <h2 className="text-xl font-semibold">
            Conductores disponibles
          </h2>

          {loadingDrivers ? (
            <p className="mt-4">Cargando conductores...</p>
          ) : drivers.length === 0 ? (
            <p className="mt-4">
              No hay conductores disponibles ahora mismo.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {drivers.map((driver) => (
                <article
                  key={driver.id}
                  className="rounded-xl border p-4"
                >
                  <p className="font-medium">
                    {driver.firstName} {driver.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {driver.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    Rating: {driver.rating.toFixed(1)}
                  </p>
                </article>
              ))}
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}