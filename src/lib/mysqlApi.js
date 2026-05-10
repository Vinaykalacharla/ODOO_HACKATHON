/**
 * MySQL API Service
 * Connects your React frontend to the Express/MySQL backend at http://localhost:5000
 */

const BASE_URL = 'http://localhost:5000/api';

// Helper: handle response
async function handleResponse(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'API request failed');
  }
  return res.json();
}

// ─── Health Check ────────────────────────────────────────────────────────────
export async function checkDbHealth() {
  const res = await fetch(`${BASE_URL}/health`);
  return handleResponse(res);
}

// ─── Get all tables in the database ──────────────────────────────────────────
export async function getTables() {
  const res = await fetch(`${BASE_URL}/tables`);
  return handleResponse(res);
}

// ─── Students CRUD ───────────────────────────────────────────────────────────
export async function getStudents() {
  const res = await fetch(`${BASE_URL}/students`);
  return handleResponse(res);
}

export async function getStudent(id) {
  const res = await fetch(`${BASE_URL}/students/${id}`);
  return handleResponse(res);
}

export async function createStudent(data) {
  const res = await fetch(`${BASE_URL}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateStudent(id, data) {
  const res = await fetch(`${BASE_URL}/students/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteStudent(id) {
  const res = await fetch(`${BASE_URL}/students/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(res);
}
