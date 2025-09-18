<script>
  import { resolve } from '$app/paths';
  import '@fontsource-variable/noto-sans';
  import '../global.css';
</script>

<header class="header">
  <a class="link title" href={resolve('/')}>Cody</a>
  <nav class="nav">
    <a class="link" href={resolve('/list')}>View Files</a>
  </nav>
</header>

<slot />

<style>
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-4) var(--space-6);
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    box-shadow: var(--shadow-sm);
  }

  .title {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-primary);
    text-decoration: none;
  }

  .nav {
    display: flex;
    gap: var(--space-4);
  }

  .link {
    color: var(--color-text-primary);
    text-decoration: none;
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    padding: var(--space-1) var(--space-2);
    transition: color var(--transition-fast);
  }

  .link:hover {
    color: var(--color-primary);
  }
</style>
