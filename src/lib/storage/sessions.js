const STORAGE_KEY = 'cage_sessions';
const CURRENT_KEY = 'cage_current';
const THEME_KEY = 'cage_theme';

function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAll(sessions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function getSessions() {
  return loadAll().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getSession(id) {
  return loadAll().find(s => s.id === id) || null;
}

export function saveSession(session) {
  const sessions = loadAll();
  const idx = sessions.findIndex(s => s.id === session.id);
  session.updatedAt = Date.now();
  if (idx >= 0) {
    sessions[idx] = session;
  } else {
    session.createdAt = Date.now();
    sessions.push(session);
  }
  saveAll(sessions);
}

export function deleteSession(id) {
  const sessions = loadAll().filter(s => s.id !== id);
  saveAll(sessions);
}

export function createSession(activeConstraints = []) {
  return {
    id: crypto.randomUUID(),
    text: '',
    activeConstraints,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}

export function getCurrentSessionId() {
  return localStorage.getItem(CURRENT_KEY);
}

export function setCurrentSessionId(id) {
  localStorage.setItem(CURRENT_KEY, id);
}

export function getTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored) return stored;
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}
