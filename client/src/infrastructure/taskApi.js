// In local development, Vite proxies /api requests to the Express server.
// In production, Express serves the built frontend and API from the same origin.
// Set VITE_API_URL only when the API is hosted on a separate domain.
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}/api/tasks${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const bodyPreview = (await response.text()).slice(0, 160);
    throw new Error(
      `API returned non-JSON content (HTTP ${response.status}). ` +
      `Check that the backend is running at ${API_BASE || 'the Vite /api proxy'}; ` +
      `response: ${bodyPreview}`
    );
  }

  const result = await response.json();
  if (!response.ok) {
    const error = new Error(result.message || 'Request failed');
    error.details = result.errors;
    throw error;
  }
  return result.data;
}

export const taskApi = {
  list: (search = '', status = 'All') =>
    request(`?search=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}`),
  create: task => request('', { method: 'POST', body: JSON.stringify(task) }),
  update: (id, task) => request(`/${id}`, { method: 'PUT', body: JSON.stringify(task) }),
  toggle: id => request(`/${id}/toggle`, { method: 'PATCH' }),
  remove: id => request(`/${id}`, { method: 'DELETE' }),
};
