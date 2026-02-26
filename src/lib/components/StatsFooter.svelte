<script>
  let { stats, difficulty } = $props();
</script>

<footer class="stats-footer" aria-label="Writing statistics">
  <div class="stats-left">
    <span class="stat">{stats.wordCount} word{stats.wordCount !== 1 ? 's' : ''}</span>
    <span class="stat-divider">&middot;</span>
    <span class="stat">{stats.charCount} char{stats.charCount !== 1 ? 's' : ''}</span>
  </div>
  <div class="stats-right">
    {#if stats.violationCount > 0}
      {#each Object.entries(stats.byConstraint) as [id, info]}
        <span class="stat constraint-stat">{info.name}: {info.count}</span>
      {/each}
    {/if}
  </div>
</footer>

<style>
  .stats-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    margin-top: 0.5rem;
    font-size: 0.7rem;
    color: var(--text-faint);
    font-family: var(--font-sans);
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .stats-left {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .stats-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .stat-divider {
    opacity: 0.5;
  }

  .constraint-stat {
    color: var(--accent);
    opacity: 0.8;
  }
</style>
