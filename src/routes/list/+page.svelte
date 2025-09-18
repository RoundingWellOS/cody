<script>
  import { resolve } from '$app/paths';
  const { data } = $props();
</script>

<h1 class="title">Previously Generated Files</h1>
<article class="container">
  {#each Object.entries(data.filesByYear) as [year, files] (year)}
    <section class="year-block">
      <h2 class="year">{year}</h2>
      <ul class="file-list">
        {#each files as file (file)}
          <li class="file-item">
            <a class="file-link" href={resolve(`/view/${file}`)}
              >">
              <span class="badge {file.includes('json') ? 'json' : 'csv'}">
                {file.includes('json') ? 'JSON' : 'CSV'}
              </span>
              <span class="filename">{file}</span>
            </a>
          </li>
        {/each}
      </ul>
    </section>
  {/each}
</article>

<style>
  .container {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    padding: var(--space-6);
    max-width: var(--max-width-container);
    margin: var(--space-8) auto;
  }

  .title {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--space-6);
    margin-top: var(--space-6);
    color: var(--color-primary);
    text-align: center;
  }

  .year-block {
    margin-bottom: var(--space-6);
  }

  .year {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--color-primary);
    margin-bottom: var(--space-3);
    letter-spacing: 0.02em;
  }

  .file-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .file-item {
    display: flex;
  }

  .file-link {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    background: var(--color-surface-alt);
    border-radius: var(--radius-sm);
    padding: var(--space-2) var(--space-4);
    text-decoration: none;
    color: var(--color-text-primary);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    transition:
      background var(--transition-fast),
      color var(--transition-fast);
    border: 1px solid var(--color-border);
  }

  .file-link:hover {
    background: var(--color-primary-light);
    color: var(--color-primary);
    border-color: var(--color-primary);
  }

  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
    border-radius: var(--radius-full);
    padding: 0 var(--space-3);
    height: 1.5rem;
    letter-spacing: 0.05em;
    margin-right: var(--space-2);
  }

  .badge.json {
    background: var(--color-primary-light);
    color: var(--color-primary);
  }

  .badge.csv {
    background: var(--color-success);
    color: var(--color-text-inverse);
  }

  .filename {
    font-family: var(--font-family-base);
    font-size: var(--font-size-base);
    color: var(--color-text-secondary);
    word-break: break-all;
  }
</style>
