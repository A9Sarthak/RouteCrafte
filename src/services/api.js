const API_BASE =
  import.meta?.env?.VITE_API_URL?.replace(/\/+$/, "") ||
  "http://localhost:4000/api";

/**
 * Generic request helper wrapping fetch with JSON defaults and cookie credentials.
 * Throws an Error with { status, details } when the response is not ok.
 *
 * @param {string} path
 * @param {RequestInit} options
 */
async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  // Include credentials so that cookies are sent and received
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include"
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const error = new Error(
      (data && data.error) || res.statusText || "Request failed",
    );
    error.status = res.status;
    error.details = data;
    throw error;
  }

  return data;
}

export async function login(payload) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function register(payload) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function logout() {
  return request("/auth/logout", {
    method: "POST",
  });
}

export function getMe() {
  return request("/me");
}

export function getJourneys() {
  return request("/journeys");
}

export function createJourney(payload) {
  return request("/journeys", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateJourney(id, updates) {
  return request(`/journeys/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export function deleteJourney(id) {
  return request(`/journeys/${id}`, { method: "DELETE" });
}

export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append("avatar", file);
  
  const res = await fetch(`${API_BASE}/users/avatar`, {
    method: "POST",
    credentials: "include",
    body: formData
  });
  
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to upload avatar");
  }
  return res.json();
}

export function updateProfile(payload) {
  return request("/users/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function shareJourney(id, email) {
  return request(`/journeys/${id}/share`, { method: "POST", body: { email } });
}

export function authorizedRequest(path, options) {
  return request(path, options);
}

export default {
  login,
  register,
  logout,
  getMe,
  getJourneys,
  createJourney,
  updateJourney,
  deleteJourney,
  uploadAvatar,
  updateProfile,
  shareJourney,
  authorizedRequest,
};
