import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../services/authService";

import type {
  LoginRequest,
  RegisterRequest,
  User,
} from "../types";


interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;

  login: (data: LoginRequest) => Promise<User>;
  register: (data: RegisterRequest) => Promise<User>;
  logout: () => void;
}


const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);


export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token")
  );

  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);


  const clearSession = () => {

    localStorage.removeItem("token");

    setToken(null);
    setUser(null);

  };


  const loadCurrentUser = async (): Promise<User> => {

    const currentUser = await getCurrentUser();

    setUser(currentUser);

    return currentUser;

  };


  const login = async (
    data: LoginRequest
  ): Promise<User> => {

    const authResponse = await loginUser(data);

    const jwt = authResponse.token;

    localStorage.setItem("token", jwt);

    setToken(jwt);


    try {

      const currentUser =
        await loadCurrentUser();

      return currentUser;

    } catch (error) {

      clearSession();

      throw error;

    }

  };


  const register = async (
    data: RegisterRequest
  ): Promise<User> => {

    const authResponse =
      await registerUser(data);

    const jwt = authResponse.token;

    localStorage.setItem("token", jwt);

    setToken(jwt);


    try {

      const currentUser =
        await loadCurrentUser();

      return currentUser;

    } catch (error) {

      clearSession();

      throw error;

    }

  };


  const logout = () => {

    clearSession();

  };


  useEffect(() => {

    const initializeAuth = async () => {

      const storedToken =
        localStorage.getItem("token");


      if (!storedToken) {

        setLoading(false);

        return;

      }


      try {

        const currentUser =
          await getCurrentUser();

        setUser(currentUser);

      } catch {

        clearSession();

      } finally {

        setLoading(false);

      }

    };


    initializeAuth();

  }, []);


  return (

    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        register,
        logout,
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}


export function useAuth() {

  const context = useContext(AuthContext);


  if (!context) {

    throw new Error(
      "useAuth debe usarse dentro de AuthProvider"
    );

  }


  return context;

}