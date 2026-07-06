import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../context/AuthContext";


export default function LoginPage() {

  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();

    setError("");
    setLoading(true);

    try {

      const currentUser = await login({
        email,
        password,
      });


      if (currentUser.role === "PASSENGER") {

        navigate("/passenger");

      } else {

        navigate("/driver");

      }

    } catch (err) {

      if (axios.isAxiosError(err)) {

        if (err.response?.status === 401) {

          setError(
            "Correo o contraseña incorrectos."
          );

        } else if (err.response?.status === 404) {

          setError(
            "No existe una cuenta con ese correo."
          );

        } else {

          setError(
            err.response?.data?.error ??
            "Ocurrió un error al iniciar sesión."
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


  return (
    <main>

      <section>

        <h1>Iniciar sesión</h1>


        <form onSubmit={handleSubmit}>

          <div>

            <label htmlFor="email">
              Correo electrónico
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="ana@uber.com"
              required
            />

          </div>


          <div>

            <label htmlFor="password">
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Ingresa tu contraseña"
              required
            />

          </div>


          {error && (
            <p role="alert">
              {error}
            </p>
          )}


          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Ingresando..."
              : "Iniciar sesión"}
          </button>

        </form>


        <p>
          ¿No tienes una cuenta?{" "}

          <Link to="/register">
            Regístrate
          </Link>
        </p>

      </section>

    </main>
  );
}