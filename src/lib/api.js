const API_BASE = import.meta.env.VITE_BACKEND_URL || 'https://backend.steadily.me';

function getAuthHeaders() {
  const token = localStorage.getItem('steadily_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    let errMsg = `Request failed ${res.status}`;
    try {
      const data = await res.json();
      errMsg = data.message || data.error || errMsg;
    } catch {}
    throw new Error(errMsg);
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

export const api = {
  // Auth
  login: (email, password) => request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (email, password) => request('/api/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) }),
  google: (credential) => request('/api/auth/google', { method: 'POST', body: JSON.stringify({ credential }) }),
  forgotPassword: (email) => request('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  me: () => request('/api/me', { method: 'GET' }),

  // Habits
  getHabits: () => request('/api/habits', { method: 'GET' }),
  createHabit: (habit) => request('/api/habits', { method: 'POST', body: JSON.stringify(habit) }),
  updateHabit: (id, updates) => request(`/api/habits/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deleteHabit: (id) => request(`/api/habits/${id}`, { method: 'DELETE' }),

  // Completions
  getCompletions: (start, end) => request(`/api/completions?start=${start}&end=${end}`, { method: 'GET' }),
  toggleCompletion: (habit_id, date) => request('/api/completions', { method: 'POST', body: JSON.stringify({ habit_id, date }) }),

  version: () => request('/api/version', { method: 'GET' }),
};

export function formatDate(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day; // Monday start
  d.setDate(d.getDate() + diff);
  d.setHours(0,0,0,0);
  return d;
}

export function endOfWeek(date) {
  const s = startOfWeek(date);
  const e = new Date(s);
  e.setDate(s.getDate() + 6);
  return e;
}

export function addWeeks(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n * 7);
  return d;
}
