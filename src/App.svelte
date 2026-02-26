<script>
  import { validate, getDifficulty, constraintMap, getDefaultParams, constraints as allConstraints } from './lib/constraints/index.js';
  import { computeStats } from './lib/engine/stats.js';
  import { createSession, saveSession, getSessions, getSession, deleteSession, getCurrentSessionId, setCurrentSessionId, getTheme, setTheme } from './lib/storage/sessions.js';
  import { decodeSession, getShareUrl } from './lib/sharing/encoder.js';
  import Editor from './lib/components/Editor.svelte';
  import ConstraintPicker from './lib/components/ConstraintPicker.svelte';
  import ConstraintPills from './lib/components/ConstraintPills.svelte';
  import StatsFooter from './lib/components/StatsFooter.svelte';
  import ThemeToggle from './lib/components/ThemeToggle.svelte';
  import SessionList from './lib/components/SessionList.svelte';
  import ShareModal from './lib/components/ShareModal.svelte';

  let text = $state('');
  let activeConstraints = $state([]);
  let sessionId = $state(null);
  let theme = $state(getTheme());
  let showPicker = $state(false);
  let showSessions = $state(false);
  let showShare = $state(false);
  let shareUrl = $state('');
  let copied = $state(false);

  // Validation (debounced effect handled in derived)
  let violations = $derived(validate(text, activeConstraints));
  let stats = $derived(computeStats(text, violations));
  let difficulty = $derived(getDifficulty(activeConstraints));

  // Theme
  $effect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    setTheme(theme);
  });

  // Auto-save
  let saveTimer;
  $effect(() => {
    // Access reactive values to track them
    const _t = text;
    const _c = activeConstraints;

    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      if (sessionId) {
        saveSession({ id: sessionId, text: _t, activeConstraints: _c });
      }
    }, 2000);
  });

  // Load session on mount (runs once during component init)
  function initSession() {
    // Check URL hash for shared session
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      const shared = decodeSession(hash);
      if (shared) {
        const session = createSession(shared.activeConstraints);
        session.text = shared.text;
        saveSession(session);
        setCurrentSessionId(session.id);
        sessionId = session.id;
        text = session.text;
        activeConstraints = session.activeConstraints;
        history.replaceState(null, '', window.location.pathname);
        return;
      }
    }

    // Load current session or create new
    const currentId = getCurrentSessionId();
    if (currentId) {
      const session = getSession(currentId);
      if (session) {
        sessionId = session.id;
        text = session.text;
        activeConstraints = session.activeConstraints || [];
        return;
      }
    }

    // Create a fresh session
    const session = createSession();
    saveSession(session);
    setCurrentSessionId(session.id);
    sessionId = session.id;
  }

  initSession();

  function toggleConstraint(id) {
    const idx = activeConstraints.findIndex(c => c.id === id);
    if (idx >= 0) {
      activeConstraints = activeConstraints.filter((_, i) => i !== idx);
    } else {
      activeConstraints = [...activeConstraints, { id, params: getDefaultParams(id) }];
    }
  }

  function updateConstraintParams(id, params) {
    activeConstraints = activeConstraints.map(c =>
      c.id === id ? { ...c, params: { ...c.params, ...params } } : c
    );
  }

  function removeConstraint(id) {
    activeConstraints = activeConstraints.filter(c => c.id !== id);
  }

  function newSession() {
    const session = createSession();
    saveSession(session);
    setCurrentSessionId(session.id);
    sessionId = session.id;
    text = '';
    activeConstraints = [];
    showSessions = false;
  }

  function loadSession(id) {
    const session = getSession(id);
    if (session) {
      sessionId = session.id;
      text = session.text;
      activeConstraints = session.activeConstraints;
      setCurrentSessionId(session.id);
    }
    showSessions = false;
  }

  function handleDeleteSession(id) {
    deleteSession(id);
    if (id === sessionId) {
      newSession();
    }
  }

  function handleShare() {
    shareUrl = getShareUrl(text, activeConstraints);
    copied = false;
    showShare = true;
  }

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      copied = true;
      setTimeout(() => copied = false, 2000);
    });
  }

  function surpriseMe() {
    const available = allConstraints.filter(c => !activeConstraints.some(ac => ac.id === c.id));
    if (available.length === 0) return;
    const count = Math.min(1 + Math.floor(Math.random() * 2), available.length);
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, count);
    activeConstraints = [
      ...activeConstraints,
      ...picked.map(c => ({ id: c.id, params: getDefaultParams(c.id) }))
    ];
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      if (showPicker) showPicker = false;
      else if (showSessions) showSessions = false;
      else if (showShare) showShare = false;
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<a href="#editor" class="skip-link">Skip to editor</a>

<header class="header">
  <div class="header-inner">
    <div class="header-left">
      <h1 class="title">Cage</h1>
      <span class="tagline">Write freely within walls</span>
    </div>
    <div class="header-right">
      <button
        class="icon-btn"
        onclick={() => showSessions = !showSessions}
        aria-label="Sessions"
        title="Sessions"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      </button>
      {#if text.length > 0}
        <button
          class="icon-btn"
          onclick={handleShare}
          aria-label="Share"
          title="Share"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="5" r="3"/>
            <circle cx="6" cy="12" r="3"/>
            <circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </button>
      {/if}
      <ThemeToggle bind:theme />
    </div>
  </div>
</header>

<main class="main">
  <div class="editor-container">
    <ConstraintPills
      {activeConstraints}
      {difficulty}
      onRemove={removeConstraint}
      onUpdateParams={updateConstraintParams}
      onAddClick={() => showPicker = true}
    />

    <Editor
      id="editor"
      bind:text
      {violations}
      placeholder={activeConstraints.length > 0
        ? `Start writing with ${activeConstraints.map(c => constraintMap[c.id]?.name).join(' + ')}...`
        : 'Choose a constraint to begin, or just write...'}
    />

    <StatsFooter {stats} {difficulty} />
  </div>
</main>

{#if showPicker}
  <ConstraintPicker
    {activeConstraints}
    onToggle={toggleConstraint}
    onUpdateParams={updateConstraintParams}
    onClose={() => showPicker = false}
  />
{/if}

{#if showSessions}
  <SessionList
    currentId={sessionId}
    sessions={getSessions()}
    onLoad={loadSession}
    onNew={newSession}
    onDelete={handleDeleteSession}
    onClose={() => showSessions = false}
  />
{/if}

{#if showShare}
  <ShareModal
    url={shareUrl}
    {copied}
    onCopy={handleCopy}
    onClose={() => showShare = false}
  />
{/if}

<style>
  .header {
    border-bottom: 1px solid var(--border-light);
    padding: 0.75rem 1.5rem;
    position: sticky;
    top: 0;
    background: var(--bg);
    z-index: 10;
  }

  .header-inner {
    max-width: var(--max-width);
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header-left {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
  }

  .title {
    font-family: var(--font-serif);
    font-size: 1.25rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  .tagline {
    font-size: 0.8rem;
    color: var(--text-muted);
    font-style: italic;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .icon-btn {
    background: none;
    border: none;
    padding: 0.4rem;
    cursor: pointer;
    color: var(--text-muted);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color var(--transition-fast), background var(--transition-fast);
  }

  .icon-btn:hover {
    color: var(--text);
    background: var(--bg-elevated);
  }

  .main {
    flex: 1;
    padding: 2rem 1.5rem;
  }

  .editor-container {
    max-width: var(--max-width);
    margin: 0 auto;
  }

  @media (max-width: 640px) {
    .tagline {
      display: none;
    }

    .header {
      padding: 0.5rem 1rem;
    }

    .main {
      padding: 1rem;
    }
  }
</style>
