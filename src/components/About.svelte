<script>
  let { onClose } = $props();

  const constraints = [
    { name: 'Lipogram', desc: 'Forbid specific letters from your writing' },
    { name: 'Univocalic', desc: 'Only one vowel allowed in the entire text' },
    { name: 'Alphabetical', desc: 'Each sentence starts with the next letter of the alphabet' },
    { name: 'Snowball', desc: 'Each word must be one letter longer than the last' },
    { name: "Prisoner's Constraint", desc: 'Only letters with no ascenders or descenders' },
    { name: 'No Repeats', desc: 'Every word can only appear once' },
    { name: 'Word Length Limit', desc: 'No word longer than N letters' },
    { name: 'Reverse Lipogram', desc: 'Every word must contain a specific letter' },
    { name: 'Shrinking Paragraphs', desc: 'Each paragraph must have fewer words than the previous' },
    { name: 'Pilish', desc: 'Word lengths follow the digits of pi' },
  ];
</script>

<article class="about">
  <nav class="about-nav">
    <button class="back-btn" onclick={onClose} aria-label="Back to editor">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"/>
        <polyline points="12 19 5 12 12 5"/>
      </svg>
      Back
    </button>
  </nav>

  <header class="about-header">
    <h1>About Cage</h1>
    <p class="lede">A distraction-free writing environment that enforces creative constraints.</p>
  </header>

  <section class="about-section">
    <h2>What is Cage?</h2>
    <p>
      Cage is a writing tool inspired by the <strong>Oulipo</strong> tradition &mdash; the
      workshop of potential literature where writers embrace formal constraints as a creative
      catalyst. It enforces creative constraints in real time as you type, highlighting
      violations instantly. The core idea: constraints liberate creativity by forcing you to
      think differently. When you can't fall back on familiar patterns, you discover new
      ways to say what you mean.
    </p>
  </section>

  <section class="about-section">
    <h2>How it works</h2>
    <p>
      Choose one or more constraints from the picker, then write. Cage highlights violations
      in real time and tracks your compliance score. Stack multiple constraints for an extra
      challenge, or hit "Surprise me" and let Cage pick for you.
    </p>
  </section>

  <section class="about-section">
    <h2>Constraints</h2>
    <p class="section-intro">Cage ships with ten constraint types, from approachable to absurd.</p>
    <ul class="constraint-list">
      {#each constraints as c}
        <li>
          <span class="constraint-name">{c.name}</span>
          <span class="constraint-desc">{c.desc}</span>
        </li>
      {/each}
    </ul>
  </section>

  <section class="about-section">
    <h2>Built at Claude's Corner</h2>
    <p>
      Cage is part of
      <a href="https://claudescorner.dev" target="_blank" rel="noopener noreferrer">Claude's Corner</a>,
      a collection of creative tools built by
      <a href="https://claude.ai" target="_blank" rel="noopener noreferrer">Claude</a>.
      The source code is available on
      <a href="https://github.com/zexiro/cage" target="_blank" rel="noopener noreferrer">GitHub</a>.
    </p>
  </section>

  <div class="cta">
    <button class="cta-btn" onclick={onClose}>Start writing</button>
  </div>
</article>

<style>
  .about {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 2rem 1.5rem 3rem;
  }

  .about-nav {
    margin-bottom: 2rem;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 0.85rem;
    font-family: var(--font-sans);
    cursor: pointer;
    padding: 0.3rem 0.5rem 0.3rem 0.25rem;
    border-radius: 6px;
    transition: color var(--transition-fast), background var(--transition-fast);
  }

  .back-btn:hover {
    color: var(--text);
    background: var(--bg-elevated);
  }

  .about-header {
    margin-bottom: 2rem;
  }

  .about-header h1 {
    font-family: var(--font-serif);
    font-size: 1.75rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    margin-bottom: 0.5rem;
  }

  .lede {
    font-size: 1.05rem;
    color: var(--text-muted);
    line-height: 1.6;
  }

  .about-section {
    margin-bottom: 1.75rem;
  }

  .about-section h2 {
    font-family: var(--font-serif);
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    letter-spacing: -0.01em;
  }

  .about-section p {
    font-family: var(--font-sans);
    font-size: 0.9rem;
    line-height: 1.65;
    color: var(--text);
  }

  .section-intro {
    margin-bottom: 0.75rem;
  }

  .constraint-list {
    list-style: none;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }

  .constraint-list li {
    display: flex;
    flex-direction: column;
    padding: 0.6rem 0.75rem;
    background: var(--bg-elevated);
    border: 1px solid var(--border-light);
    border-radius: 8px;
    transition: border-color var(--transition-fast);
  }

  .constraint-list li:hover {
    border-color: var(--border);
  }

  .constraint-name {
    font-size: 0.8rem;
    font-weight: 600;
    font-variant: small-caps;
    text-transform: lowercase;
    letter-spacing: 0.03em;
    margin-bottom: 0.15rem;
  }

  .constraint-desc {
    font-size: 0.75rem;
    color: var(--text-muted);
    line-height: 1.4;
  }

  .about-section a {
    color: var(--accent);
    text-decoration: none;
    transition: opacity var(--transition-fast);
  }

  .about-section a:hover {
    text-decoration: underline;
  }

  .cta {
    margin-top: 2.5rem;
    text-align: center;
  }

  .cta-btn {
    display: inline-block;
    padding: 0.65rem 1.75rem;
    font-size: 0.9rem;
    font-weight: 500;
    font-family: var(--font-sans);
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: opacity var(--transition-fast);
  }

  .cta-btn:hover {
    opacity: 0.9;
  }

  @media (max-width: 640px) {
    .about {
      padding: 1rem 1rem 2rem;
    }

    .about-header h1 {
      font-size: 1.4rem;
    }

    .constraint-list {
      grid-template-columns: 1fr;
    }
  }
</style>
