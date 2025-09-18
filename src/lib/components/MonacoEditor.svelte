<script>
  import { onMount, onDestroy } from 'svelte';
  // If using the Monaco loader utility (installed via NPM):
  import loader from '@monaco-editor/loader';
  const { data } = $props();

  /**
   * Reference to the DOM element that will host the JSON editor UI (e.g. Monaco, CodeMirror).
   *
   * Lifecycle:
   * - null during SSR / before onMount
   * - Set to the bound HTMLElement after the component mounts
   *
   * Usage in markup (example):
   *   <div bind:this={editorContainer} class="editor"></div>
   *
   * Always null-check before using:
   *   if (editorContainer) {
   *     // Safe to initialize editor with editorContainer
   *   }
   *
   * @type {HTMLDivElement}
   */
  let editorContainer;
  /** @type {import('monaco-editor').editor.IStandaloneCodeEditor | null} */
  let editor = null;
  /** @type {typeof import('monaco-editor') | null} */
  let monaco = null;

  onMount(async () => {
    // Initialize Monaco Editor (loads from CDN by default)
    monaco = await loader.init(); // returns the global monaco instance

    // Register CSV language if not already registered
    if (!monaco.languages.getLanguages().some((l) => l.id === 'csv')) {
      monaco.languages.register({ id: 'csv' });
      monaco.languages.setMonarchTokensProvider('csv', {
        tokenizer: {
          root: [
            [/".*?"/, 'string'],
            [/[^,]+/, 'variable'],
            [/,/, 'delimiter'],
          ],
        },
      });
    }

    // Create the editor in the container
    editor = monaco.editor.create(editorContainer, {
      value: data.data,
      language: data.language,
    });
  });

  onDestroy(() => {
    // Cleanup: dispose editor and any models to avoid memory leaks
    editor?.dispose();
    monaco?.editor.getModels().forEach((model) => model.dispose());
  });
</script>

<div class="container">
  <div class="header">
    <span class="badge {data.language === 'javascript' ? 'json' : 'csv'}">
      {#if data.language === 'javascript'}JSON{:else}CSV{/if}
    </span>
  </div>
  <div class="editor-shell">
    <div class="editor" bind:this={editorContainer}></div>
  </div>
</div>

<style>
  .container {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    padding: var(--space-4);
    margin: var(--space-6) auto;
    max-width: var(--max-width-container);
  }

  .header {
    display: flex;
    align-items: center;
    margin-bottom: var(--space-3);
  }

  .badge {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
    border-radius: var(--radius-full);
    padding: 0 var(--space-3);
    height: 2rem;
    display: flex;
    align-items: center;
    letter-spacing: 0.05em;
  }

  /* Match list page badge colors */
  .badge.json {
    background: var(--color-primary-light);
    color: var(--color-primary);
  }

  .badge.csv {
    background: var(--color-success);
    color: var(--color-text-inverse);
  }

  .editor-shell {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-background);
    min-height: 320px;
    height: 400px;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
  }

  .editor {
    width: 100%;
    height: 100%;
  }
</style>
