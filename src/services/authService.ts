import api from "../api/axios";

import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "../types";

export async function loginUser(
  payload: LoginRequest
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(
    "/auth/login",
    payload
  );

  return data;
}

export async function registerUser(
  payload: RegisterRequest
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(
    "/auth/register",
    payload
  );

  return data;
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await api.get<User>("/users/me");

  return data;
}