<script>
  /**
   * The core editor component.
   * Uses a textarea for input with a synchronized overlay for violation highlights.
   */
  let { text = $bindable(''), violations = [], placeholder = '', id = 'editor' } = $props();

  let textareaEl = $state(null);
  let overlayEl = $state(null);

  // Sync scroll between textarea and overlay
  function handleScroll() {
    if (overlayEl && textareaEl) {
      overlayEl.scrollTop = textareaEl.scrollTop;
      overlayEl.scrollLeft = textareaEl.scrollLeft;
    }
  }

  // Build highlighted HTML from text + violations
  let highlightedHtml = $derived.by(() => {
    if (!text) return '';
    if (violations.length === 0) return escapeHtml(text);

    // Merge overlapping violations into ranges
    const ranges = mergeRanges(violations);
    let html = '';
    let cursor = 0;

    for (const range of ranges) {
      // Text before this range
      if (range.start > cursor) {
        html += escapeHtml(text.slice(cursor, range.start));
      }
      // Highlighted text
      html += `<mark class="violation" title="${escapeAttr(range.message)}">${escapeHtml(text.slice(range.start, range.end))}</mark>`;
      cursor = range.end;
    }

    // Remaining text
    if (cursor < text.length) {
      html += escapeHtml(text.slice(cursor));
    }

    return html;
  });

  function mergeRanges(violations) {
    if (violations.length === 0) return [];

    const sorted = [...violations].sort((a, b) => a.start - b.start);
    const merged = [{ ...sorted[0] }];

    for (let i = 1; i < sorted.length; i++) {
      const last = merged[merged.length - 1];
      const curr = sorted[i];

      if (curr.start <= last.end) {
        last.end = Math.max(last.end, curr.end);
        last.message = last.message; // keep first message
      } else {
        merged.push({ ...curr });
      }
    }

    return merged;
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '\n');
  }

  function escapeAttr(str) {
    return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
</script>

<div class="editor-wrapper">
  <div
    class="editor-overlay"
    bind:this={overlayEl}
    aria-hidden="true"
  >{@html highlightedHtml || `<span class="placeholder-text">${escapeHtml(placeholder)}</span>`}</div>
  <textarea
    {id}
    class="editor-textarea"
    bind:this={textareaEl}
    bind:value={text}
    onscroll={handleScroll}
    placeholder=""
    spellcheck="true"
    autocomplete="off"
    aria-label="Writing editor"
  ></textarea>
  <div class="violation-count" aria-live="polite">
    {#if violations.length > 0}
      <span class="count-badge violation-badge">{violations.length} violation{violations.length !== 1 ? 's' : ''}</span>
    {:else if text.length > 0}
      <span class="count-badge clean-badge">Clean</span>
    {/if}
  </div>
</div>

<style>
  .editor-wrapper {
    position: relative;
    min-height: 400px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--bg);
    transition: border-color var(--transition-fast);
  }

  .editor-wrapper:focus-within {
    border-color: var(--accent);
  }

  .editor-overlay,
  .editor-textarea {
    font-family: var(--font-serif);
    font-size: var(--editor-size);
    line-height: var(--editor-line-height);
    padding: 1.25rem 1.5rem;
    width: 100%;
    min-height: 400px;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .editor-textarea {
    position: relative;
    z-index: 2;
    background: transparent;
    color: transparent;
    border: none;
    resize: vertical;
    outline: none;
    caret-color: var(--text);
    -webkit-text-fill-color: transparent;
  }

  .editor-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    color: var(--text);
    pointer-events: none;
    overflow: hidden;
  }

  .editor-overlay :global(.violation) {
    background: var(--accent-soft);
    border-bottom: 2px solid var(--accent);
    border-radius: 1px;
  }

  .editor-overlay :global(.placeholder-text) {
    color: var(--text-faint);
  }

  .violation-count {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    z-index: 3;
  }

  .count-badge {
    font-family: var(--font-sans);
    font-size: 0.7rem;
    font-weight: 500;
    padding: 0.2rem 0.5rem;
    border-radius: 10px;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .violation-badge {
    background: var(--accent-soft);
    color: var(--accent);
  }

  .clean-badge {
    background: var(--clean-soft);
    color: var(--clean);
  }

  @media (max-width: 640px) {
    .editor-overlay,
    .editor-textarea {
      padding: 1rem;
      font-size: 1rem;
      min-height: 300px;
    }

    .editor-wrapper {
      min-height: 300px;
    }
  }
</style>
