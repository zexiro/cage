<script>
  import { constraints, getDefaultParams } from '../constraints/index.js';

  let { activeConstraints = [], onToggle, onUpdateParams, onClose } = $props();

  let backdropEl = $state(null);

  function isActive(id) {
    return activeConstraints.some(c => c.id === id);
  }

  function getParams(id) {
    const ac = activeConstraints.find(c => c.id === id);
    return ac?.params || getDefaultParams(id);
  }

  function handleBackdropClick(e) {
    if (e.target === backdropEl) onClose();
  }

  function difficultyStars(level) {
    return '\u2666'.repeat(level) + '\u2662'.repeat(5 - level);
  }

  function handleLetterToggle(constraintId, paramId, letter, currentLetters) {
    const letters = [...currentLetters];
    const idx = letters.indexOf(letter);
    if (idx >= 0) {
      if (letters.length > 1) letters.splice(idx, 1);
    } else {
      letters.push(letter);
    }
    onUpdateParams(constraintId, { [paramId]: letters });
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
  aria-label="Choose constraints"
>
  <div class="picker">
    <div class="picker-header">
      <h2>Constraints</h2>
      <button class="close-btn" onclick={onClose} aria-label="Close">&times;</button>
    </div>

    <div class="constraint-grid">
      {#each constraints as constraint (constraint.id)}
        {@const active = isActive(constraint.id)}
        <button
          class="constraint-card"
          class:active
          onclick={() => onToggle(constraint.id)}
          aria-pressed={active}
        >
          <div class="card-header">
            <span class="card-name">{constraint.name}</span>
            <span class="card-difficulty">{difficultyStars(constraint.difficulty)}</span>
          </div>
          <p class="card-desc">{constraint.description}</p>
        </button>

        {#if active && constraint.parameters.length > 0}
          <div class="param-panel">
            {#each constraint.parameters as param}
              {#if param.type === 'letters'}
                <div class="param-group">
                  <span class="param-label">{param.label}</span>
                  <div class="letter-grid">
                    {#each 'abcdefghijklmnopqrstuvwxyz'.split('') as letter}
                      {@const selected = (getParams(constraint.id)[param.id] || param.default).includes(letter)}
                      <button
                        class="letter-btn"
                        class:selected
                        onclick={(e) => {
                          e.stopPropagation();
                          handleLetterToggle(constraint.id, param.id, letter, getParams(constraint.id)[param.id] || param.default);
                        }}
                      >{letter}</button>
                    {/each}
                  </div>
                </div>
              {:else if param.type === 'select'}
                <div class="param-group">
                  <span class="param-label">{param.label}</span>
                  <div class="option-row">
                    {#each param.options as option}
                      <button
                        class="option-btn"
                        class:selected={(getParams(constraint.id)[param.id] || param.default) === option}
                        onclick={(e) => {
                          e.stopPropagation();
                          onUpdateParams(constraint.id, { [param.id]: option });
                        }}
                      >{option}</button>
                    {/each}
                  </div>
                </div>
              {:else if param.type === 'number'}
                <div class="param-group">
                  <label class="param-label" for="range-{constraint.id}-{param.id}">{param.label}: {getParams(constraint.id)[param.id] || param.default}</label>
                  <input
                    id="range-{constraint.id}-{param.id}"
                    type="range"
                    min={param.min}
                    max={param.max}
                    value={getParams(constraint.id)[param.id] || param.default}
                    oninput={(e) => {
                      e.stopPropagation();
                      onUpdateParams(constraint.id, { [param.id]: parseInt(e.target.value) });
                    }}
                    onclick={(e) => e.stopPropagation()}
                    class="param-range"
                  />
                </div>
              {:else if param.type === 'letter'}
                <div class="param-group">
                  <span class="param-label">{param.label}</span>
                  <div class="letter-grid">
                    {#each 'abcdefghijklmnopqrstuvwxyz'.split('') as letter}
                      <button
                        class="letter-btn"
                        class:selected={(getParams(constraint.id)[param.id] || param.default) === letter}
                        onclick={(e) => {
                          e.stopPropagation();
                          onUpdateParams(constraint.id, { [param.id]: letter });
                        }}
                      >{letter}</button>
                    {/each}
                  </div>
                </div>
              {/if}
            {/each}
          </div>
        {/if}
      {/each}
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

  .picker {
    background: var(--bg);
    border-radius: 16px 16px 8px 8px;
    max-width: 600px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    padding: 1.5rem;
    box-shadow: 0 -4px 24px var(--shadow);
  }

  .picker-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .picker-header h2 {
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

  .constraint-grid {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .constraint-card {
    text-align: left;
    padding: 0.75rem 1rem;
    background: var(--bg-elevated);
    border: 1px solid var(--border-light);
    border-radius: 8px;
    cursor: pointer;
    color: var(--text);
    transition: border-color var(--transition-fast), background var(--transition-fast);
    width: 100%;
  }

  .constraint-card:hover {
    border-color: var(--text-muted);
  }

  .constraint-card.active {
    border-color: var(--accent);
    background: var(--accent-soft);
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.25rem;
  }

  .card-name {
    font-weight: 600;
    font-size: 0.875rem;
    font-variant: small-caps;
    text-transform: lowercase;
    letter-spacing: 0.03em;
  }

  .card-difficulty {
    font-size: 0.7rem;
    color: var(--text-faint);
    letter-spacing: 0.05em;
  }

  .card-desc {
    font-size: 0.8rem;
    color: var(--text-muted);
    line-height: 1.4;
  }

  .param-panel {
    padding: 0.5rem 1rem 0.75rem;
    margin-top: -0.25rem;
    border: 1px solid var(--accent-medium);
    border-top: none;
    border-radius: 0 0 8px 8px;
    background: var(--accent-soft);
  }

  .param-group {
    margin-bottom: 0.5rem;
  }

  .param-group:last-child {
    margin-bottom: 0;
  }

  .param-label {
    display: block;
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--text-muted);
    margin-bottom: 0.3rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .letter-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.2rem;
  }

  .letter-btn {
    width: 1.6rem;
    height: 1.6rem;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    cursor: pointer;
    color: var(--text-muted);
    transition: all var(--transition-fast);
  }

  .letter-btn.selected {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
  }

  .letter-btn:hover:not(.selected) {
    border-color: var(--accent);
    color: var(--text);
  }

  .option-row {
    display: flex;
    gap: 0.3rem;
  }

  .option-btn {
    padding: 0.25rem 0.6rem;
    font-size: 0.75rem;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    cursor: pointer;
    color: var(--text-muted);
    text-transform: uppercase;
    font-weight: 600;
    transition: all var(--transition-fast);
  }

  .option-btn.selected {
    background: var(--accent);
    color: white;
    border-color: var(--accent);
  }

  .param-range {
    width: 100%;
    accent-color: var(--accent);
  }

  @media (min-width: 641px) {
    .backdrop {
      align-items: center;
    }

    .picker {
      border-radius: 12px;
      max-height: 70vh;
    }
  }
</style>
