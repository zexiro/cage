<script>
  import { constraintMap } from '../constraints/index.js';

  let { activeConstraints = [], difficulty = { level: 0, label: 'Free' }, onRemove, onUpdateParams, onAddClick } = $props();
</script>

<div class="pills-bar" role="list" aria-label="Active constraints">
  {#each activeConstraints as ac (ac.id)}
    {@const constraint = constraintMap[ac.id]}
    {#if constraint}
      <div class="pill" role="listitem">
        <span class="pill-name">{constraint.name}</span>
        {#each constraint.parameters as param}
          {#if param.type === 'letters'}
            <span class="pill-param">
              {(ac.params[param.id] || param.default).join(', ').toUpperCase()}
            </span>
          {:else if param.type === 'select'}
            <span class="pill-param">{ac.params[param.id] || param.default}</span>
          {:else if param.type === 'number'}
            <span class="pill-param">{ac.params[param.id] || param.default}</span>
          {:else if param.type === 'letter'}
            <span class="pill-param">{(ac.params[param.id] || param.default).toUpperCase()}</span>
          {/if}
        {/each}
        <button
          class="pill-remove"
          onclick={() => onRemove(ac.id)}
          aria-label="Remove {constraint.name} constraint"
        >&times;</button>
      </div>
    {/if}
  {/each}

  <button class="add-btn" onclick={onAddClick} aria-label="Add constraint">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
    {#if activeConstraints.length === 0}
      <span>Add constraint</span>
    {/if}
  </button>

  {#if activeConstraints.length > 0}
    <span class="difficulty difficulty-{difficulty.level}">{difficulty.label}</span>
  {/if}
</div>

<style>
  .pills-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.75rem;
    min-height: 2rem;
  }

  .pill {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.25rem 0.5rem;
    background: var(--accent-soft);
    border: 1px solid var(--accent-medium);
    border-radius: 14px;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--accent);
    transition: transform var(--transition-fast);
  }

  .pill-name {
    font-variant: small-caps;
    text-transform: lowercase;
    letter-spacing: 0.04em;
  }

  .pill-param {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    opacity: 0.8;
  }

  .pill-remove {
    background: none;
    border: none;
    color: var(--accent);
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
    padding: 0 0.1rem;
    opacity: 0.6;
    transition: opacity var(--transition-fast);
  }

  .pill-remove:hover {
    opacity: 1;
  }

  .add-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.25rem 0.5rem;
    background: var(--bg-elevated);
    border: 1px dashed var(--border);
    border-radius: 14px;
    font-size: 0.75rem;
    color: var(--text-muted);
    cursor: pointer;
    transition: color var(--transition-fast), border-color var(--transition-fast);
  }

  .add-btn:hover {
    color: var(--text);
    border-color: var(--text-muted);
  }

  .difficulty {
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 0.15rem 0.4rem;
    border-radius: 8px;
    margin-left: auto;
  }

  .difficulty-1 { color: var(--clean); background: var(--clean-soft); }
  .difficulty-2 { color: #B8963E; background: rgba(184, 150, 62, 0.1); }
  .difficulty-3 { color: var(--accent); background: var(--accent-soft); }
  .difficulty-4 { color: #C44A4A; background: rgba(196, 74, 74, 0.1); }
</style>
