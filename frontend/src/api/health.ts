import { apiRequest } from "./client";

export type BackendHealth = {
  status: string;
  service: string;
  mode: string;
};

export async function fetchBackendHealth(): Promise<BackendHealth> {
  return apiRequest<BackendHealth>("/health");
}
