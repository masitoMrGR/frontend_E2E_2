import api from "../api/axios";
import type {
  CreateTripRequest,
  RateTripRequest,
  Trip,
  User,
} from "../types";

export async function getAvailableDrivers(): Promise<User[]> {
  const { data } = await api.get<User[]>("/drivers/available");
  return data;
}

export async function createTrip(
  payload: CreateTripRequest
): Promise<Trip> {
  const { data } = await api.post<Trip>("/trips", payload);
  return data;
}

export async function getPassengerTrips(): Promise<Trip[]> {
  const { data } = await api.get<Trip[]>("/trips");
  return data;
}

export async function getPendingTrips(): Promise<Trip[]> {
  const { data } = await api.get<Trip[]>("/trips/pending");
  return data;
}

export async function getDriverTrips(): Promise<Trip[]> {
  const { data } = await api.get<Trip[]>("/trips/my");
  return data;
}

export async function getTripById(id: number | string): Promise<Trip> {
  const { data } = await api.get<Trip>(`/trips/${id}`);
  return data;
}

export async function acceptTrip(id: number | string): Promise<Trip> {
  const { data } = await api.patch<Trip>(`/trips/${id}/accept`);
  return data;
}

export async function completeTrip(id: number | string): Promise<Trip> {
  const { data } = await api.patch<Trip>(`/trips/${id}/complete`);
  return data;
}

export async function rateTrip(
  id: number | string,
  payload: RateTripRequest
): Promise<Trip> {
  const { data } = await api.post<Trip>(`/trips/${id}/rate`, payload);
  return data;
}