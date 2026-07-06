import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../context/AuthContext";
import type { Role } from "../types";


export default function RegisterPage() {

  const navigate = useNavigate();
  const { register } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] =
    useState<Role>("PASSENGER");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();

    setError("");


    if (password.length < 6) {

      setError(
        "La contraseña debe tener al menos 6 caracteres."
      );

      return;
    }


    setLoading(true);


    try {

      const currentUser = await register({
        firstName,
        lastName,
        email,
        password,
        role,
      });


      if (currentUser.role === "PASSENGER") {

        navigate("/passenger");

      } else {

        navigate("/driver");

      }

    } catch (err) {

      if (axios.isAxiosError(err)) {

        const responseData = err.response?.data;


        if (responseData?.error) {

          setError(responseData.error);

        } else if (responseData) {

          const validationMessage =
            Object.values(responseData)[0];

          setError(
            typeof validationMessage === "string"
              ? validationMessage
              : "Los datos ingresados no son válidos."
          );

        } else {

          setError(
            "Ocurrió un error al registrar la cuenta."
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

        <h1>Crear cuenta</h1>


        <form onSubmit={handleSubmit}>

          <div>

            <label htmlFor="firstName">
              Nombre
            </label>

            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(event) =>
                setFirstName(event.target.value)
              }
              required
            />

          </div>


          <div>

            <label htmlFor="lastName">
              Apellido
            </label>

            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(event) =>
                setLastName(event.target.value)
              }
              required
            />

          </div>


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
              minLength={6}
              required
            />

          </div>


          <fieldset>

            <legend>
              ¿Cómo usarás la aplicación?
            </legend>


            <label>

              <input
                type="radio"
                name="role"
                value="PASSENGER"
                checked={role === "PASSENGER"}
                onChange={() =>
                  setRole("PASSENGER")
                }
              />

              Pasajero

            </label>


            <label>

              <input
                type="radio"
                name="role"
                value="DRIVER"
                checked={role === "DRIVER"}
                onChange={() =>
                  setRole("DRIVER")
                }
              />

              Conductor

            </label>

          </fieldset>


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
              ? "Creando cuenta..."
              : "Crear cuenta"}
          </button>

        </form>


        <p>
          ¿Ya tienes una cuenta?{" "}

          <Link to="/login">
            Inicia sesión
          </Link>
        </p>

      </section>

    </main>
  );
}