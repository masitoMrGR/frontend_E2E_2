import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";


import { useAuth } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";


import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import PassengerDashboardPage from "./pages/PassengerDashboardPage";
import RequestTripPage from "./pages/RequestTripPage";
import PassengerTripDetailPage from "./pages/PassengerTripDetailPage";

import DriverDashboardPage from "./pages/DriverDashboardPage";
import DriverTripDetailPage from "./pages/DriverTripDetailPage";

import HistoryPage from "./pages/HistoryPage";


function HomeRedirect() {

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


export default function App() {

  return (

    <BrowserRouter>

      <Routes>


        <Route
          path="/"
          element={<HomeRedirect />}
        />


        <Route
          path="/login"
          element={<LoginPage />}
        />


        <Route
          path="/register"
          element={<RegisterPage />}
        />


        {/* ========================= */}
        {/* PASSENGER */}
        {/* ========================= */}


        <Route
          path="/passenger"
          element={

            <ProtectedRoute
              allowedRoles={["PASSENGER"]}
            >

              <PassengerDashboardPage />

            </ProtectedRoute>

          }
        />


        <Route
          path="/passenger/request"
          element={

            <ProtectedRoute
              allowedRoles={["PASSENGER"]}
            >

              <RequestTripPage />

            </ProtectedRoute>

          }
        />


        <Route
          path="/passenger/trips/:id"
          element={

            <ProtectedRoute
              allowedRoles={["PASSENGER"]}
            >

              <PassengerTripDetailPage />

            </ProtectedRoute>

          }
        />


        {/* ========================= */}
        {/* DRIVER */}
        {/* ========================= */}


        <Route
          path="/driver"
          element={

            <ProtectedRoute
              allowedRoles={["DRIVER"]}
            >

              <DriverDashboardPage />

            </ProtectedRoute>

          }
        />


        <Route
          path="/driver/trips/:id"
          element={

            <ProtectedRoute
              allowedRoles={["DRIVER"]}
            >

              <DriverTripDetailPage />

            </ProtectedRoute>

          }
        />


        {/* ========================= */}
        {/* HISTORY */}
        {/* ========================= */}


        <Route
          path="/history"
          element={

            <ProtectedRoute
              allowedRoles={[
                "PASSENGER",
                "DRIVER",
              ]}
            >

              <HistoryPage />

            </ProtectedRoute>

          }
        />


        {/* ========================= */}
        {/* NOT FOUND */}
        {/* ========================= */}


        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />


      </Routes>

    </BrowserRouter>

  );

}