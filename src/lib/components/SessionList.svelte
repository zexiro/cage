<script>
  import { constraintMap } from '../constraints/index.js';

  let { currentId, sessions = [], onLoad, onNew, onDelete, onClose } = $props();

  let backdropEl = $state(null);

  function handleBackdropClick(e) {
    if (e.target === backdropEl) onClose();
  }

  function formatDate(ts) {
    const d = new Date(ts);
    const now = new Date();
    const diff = now - d;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString();
  }

  function getWordCount(text) {
    if (!text) return 0;
    return text.split(/\s+/).filter(w => w.length > 0).length;
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_interactive_supports_focus -->
<div
  class="backdrop"
  bind:this={backdropEl}
  onclick={handleBackdropClick}
  onkeydown={(e) => e.key === 'Escape' && onClose()}
  role="dialog"
  aria-modal="true"
  aria-label="Sessions"
>
  <div class="panel">
    <div class="panel-header">
      <h2>Sessions</h2>
      <div class="panel-actions">
        <button class="new-btn" onclick={onNew}>New</button>
        <button class="close-btn" onclick={onClose} aria-label="Close">&times;</button>
      </div>
    </div>

    <div class="session-list">
      {#each sessions as session (session.id)}
        <div
          class="session-item"
          class:current={session.id === currentId}
          role="button"
          tabindex="0"
          onclick={() => onLoad(session.id)}
          onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && onLoad(session.id)}
        >
          <div class="session-meta">
            <span class="session-date">{formatDate(session.updatedAt)}</span>
            <span class="session-words">{getWordCount(session.text)} words</span>
          </div>
          <div class="session-constraints">
            {#if session.activeConstraints?.length > 0}
              {#each session.activeConstraints as ac}
                <span class="mini-pill">{constraintMap[ac.id]?.name || ac.id}</span>
              {/each}
            {:else}
              <span class="no-constraints">No constraints</span>
            {/if}
          </div>
          <p class="session-preview">{session.text?.slice(0, 80) || 'Empty'}{session.text?.length > 80 ? '...' : ''}</p>
          {#if session.id !== currentId}
            <button
              class="delete-btn"
              onclick={(e) => { e.stopPropagation(); onDelete(session.id); }}
              aria-label="Delete session"
            >&times;</button>
          {/if}
        </div>
      {/each}

      {#if sessions.length === 0}
        <p class="empty">No sessions yet. Start writing!</p>
      {/if}
    </div>
  </div>
</div>

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    z-index: 50;
    padding: 1rem;
  }

  .panel {
    background: var(--bg);
    border-radius: 16px 16px 8px 8px;
    max-width: 500px;
    width: 100%;
    max-height: 70vh;
    overflow-y: auto;
    padding: 1.25rem;
    box-shadow: 0 -4px 24px var(--shadow);
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .panel-header h2 {
    font-family: var(--font-serif);
    font-size: 1.1rem;
    font-weight: 600;
  }

  .panel-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .new-btn {
    font-size: 0.75rem;
    padding: 0.3rem 0.6rem;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--text-muted);
    padding: 0.25rem;
    line-height: 1;
  }

  .session-list {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .session-item {
    position: relative;
    text-align: left;
    padding: 0.6rem 0.75rem;
    background: var(--bg-elevated);
    border: 1px solid var(--border-light);
    border-radius: 8px;
    cursor: pointer;
    width: 100%;
    transition: border-color var(--transition-fast);
  }

  .session-item:hover {
    border-color: var(--text-muted);
  }

  .session-item.current {
    border-color: var(--accent);
  }

  .session-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.7rem;
    color: var(--text-faint);
    margin-bottom: 0.2rem;
  }

  .session-constraints {
    display: flex;
    flex-wrap: wrap;
    gap: 0.2rem;
    margin-bottom: 0.3rem;
  }

  .mini-pill {
    font-size: 0.6rem;
    padding: 0.1rem 0.35rem;
    background: var(--accent-soft);
    color: var(--accent);
    border-radius: 8px;
    font-weight: 500;
  }

  .no-constraints {
    font-size: 0.65rem;
    color: var(--text-faint);
    font-style: italic;
  }

  .session-preview {
    font-size: 0.75rem;
    color: var(--text-muted);
    line-height: 1.3;
    font-family: var(--font-serif);
  }

  .delete-btn {
    position: absolute;
    top: 0.4rem;
    right: 0.4rem;
    background: none;
    border: none;
    color: var(--text-faint);
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
    opacity: 0;
    transition: opacity var(--transition-fast);
  }

  .session-item:hover .delete-btn {
    opacity: 1;
  }

  .empty {
    text-align: center;
    color: var(--text-faint);
    font-size: 0.85rem;
    padding: 2rem;
  }

  @media (min-width: 641px) {
    .backdrop {
      align-items: center;
    }

    .panel {
      border-radius: 12px;
    }
  }
</style>
