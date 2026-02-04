export const API_BASE =
import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // Auto-logout if token expired or invalid
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("token");
    window.location.href = "/";
    throw new Error("Session expired");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API error");
  }

  return res.json();
}
