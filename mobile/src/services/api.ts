// Centralized API client service for Pak Suzuki OpsPulse Mobile

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api";

export async function fetchHealthCheck() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch (error) {
    console.warn("API health check failed:", error);
    return { status: "offline" };
  }
}
