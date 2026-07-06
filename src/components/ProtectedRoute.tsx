import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import type { Role } from "../types";


interface ProtectedRouteProps {

  children: ReactNode;

  allowedRoles: Role[];

}


export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {

  const {
    user,
    loading,
  } = useAuth();


  if (loading) {

    return (
      <main className="p-6">
        <p>Cargando...</p>
      </main>
    );

  }


  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  if (!allowedRoles.includes(user.role)) {

    return (

      <Navigate

        to={
          user.role === "PASSENGER"
            ? "/passenger"
            : "/driver"
        }

        replace

      />

    );

  }


  return <>{children}</>;

}