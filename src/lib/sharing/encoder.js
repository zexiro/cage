/**
 * URL sharing — encode/decode text + constraints into URL hash.
 * Uses simple base64 encoding (no external dependency).
 */

function encode(obj) {
  try {
    const json = JSON.stringify(obj);
    return btoa(unescape(encodeURIComponent(json)));
  } catch {
    return '';
  }
}

function decode(str) {
  try {
    const json = decodeURIComponent(escape(atob(str)));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Encode session state into a URL hash string.
 */
export function encodeSession(text, activeConstraints) {
  const data = {
    t: text,
    c: activeConstraints.map(ac => ({
      i: ac.id,
      p: ac.params
    }))
  };
  return encode(data);
}

/**
 * Decode a URL hash string into session state.
 * Returns { text, activeConstraints } or null.
 */
export function decodeSession(hash) {
  if (!hash) return null;
  // Strip leading #
  const str = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!str) return null;

  const data = decode(str);
  if (!data) return null;

  return {
    text: data.t || '',
    activeConstraints: (data.c || []).map(c => ({
      id: c.i,
      params: c.p || {}
    }))
  };
}

/**
 * Get a shareable URL for the current session.
 */
export function getShareUrl(text, activeConstraints) {
  const hash = encodeSession(text, activeConstraints);
  return `${window.location.origin}${window.location.pathname}#${hash}`;
}
