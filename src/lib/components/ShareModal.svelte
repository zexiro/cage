<script>
  let { url, copied = false, onCopy, onClose } = $props();

  let backdropEl = $state(null);

  function handleBackdropClick(e) {
    if (e.target === backdropEl) onClose();
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
  aria-label="Share"
>
  <div class="modal">
    <div class="modal-header">
      <h2>Share</h2>
      <button class="close-btn" onclick={onClose} aria-label="Close">&times;</button>
    </div>
    <p class="modal-desc">Anyone with this link will see your text and active constraints.</p>
    <div class="url-row">
      <input
        type="text"
        value={url}
        readonly
        class="url-input"
        onclick={(e) => e.target.select()}
      />
      <button class="copy-btn" onclick={onCopy}>
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  </div>
</div>

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    padding: 1rem;
  }

  .modal {
    background: var(--bg);
    border-radius: 12px;
    max-width: 480px;
    width: 100%;
    padding: 1.25rem;
    box-shadow: 0 8px 32px var(--shadow);
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .modal-header h2 {
    font-family: var(--font-serif);
    font-size: 1.1rem;
    font-weight: 600;
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

  .modal-desc {
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-bottom: 0.75rem;
  }

  .url-row {
    display: flex;
    gap: 0.5rem;
  }

  .url-input {
    flex: 1;
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    font-family: var(--font-mono);
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text);
    outline: none;
  }

  .url-input:focus {
    border-color: var(--accent);
  }

  .copy-btn {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    font-weight: 500;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    white-space: nowrap;
    transition: opacity var(--transition-fast);
  }

  .copy-btn:hover {
    opacity: 0.9;
  }
</style>
