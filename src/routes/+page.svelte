<script>
  import { enhance } from '$app/forms';

  /** @type {import('./$types').ActionData} */
  export let form;
  let loading = false;

  /** @type {import('./$types').SubmitFunction} */
  function handleSubmit() {
    loading = true;

    return async ({ update }) => {
      update();
      loading = false;
    };
  }
</script>

<h1 class="title">Cody: ICD-10 Library Generator</h1>
{#if loading}
  <p class="loading">Processing... this may take a few minutes. Time for coffee.</p>
{:else}
  <form class="form" method="POST" use:enhance={handleSubmit} enctype="multipart/form-data">
    <label class="label" for="icd_list">Add ICD-10 Code Description Text File</label>
    <input disabled={loading} class="input" name="icd_list" accept=".txt" type="file" />
    <label class="label" for="hcc_map">Add ICD-10 to HCC Mapping CSV File</label>
    <input disabled={loading} class="input" name="hcc_map" accept=".csv" type="file" />
    <button disabled={loading} class="submit button-primary">Generate Resources</button>
    {#if form?.error}
      <p class="error">{form?.message}</p>
    {/if}
  </form>
{/if}

<aside class="instructions">
  <h3>Instructions</h3>
  <p>The most recent files can be found for download at the following URLs:</p>
  <ul>
    <li>
      <a href="https://www.cdc.gov/nchs/icd/icd-10-cm/files.html" target="_blank"
        >Comprehensive Listing of ICD-10 CM Files (CDC)</a
      >
    </li>
    <li>
      <a
        href="https://www.cms.gov/medicare/payment/medicare-advantage-rates-statistics/risk-adjustment/2025-model-software/icd-10-mappings"
        target="_blank">ICD-10 Mappings (CMS)</a
      >
    </li>
  </ul>
</aside>

<style>
  .title {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--space-6);
    margin-top: var(--space-6);
    color: var(--color-primary);
    text-align: center;
  }

  .form,
  .instructions {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    padding: var(--space-6);
    max-width: var(--max-width-container);
    margin: var(--space-8) auto var(--space-6) auto;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-1);
  }

  .input[type='file'] {
    background: var(--color-surface-alt);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: var(--space-2) var(--space-3);
    font-size: var(--font-size-base);
    margin-bottom: var(--space-2);
  }

  .submit {
    margin-top: var(--space-2);
    width: 100%;
  }

  .error {
    color: var(--color-danger);
    font-size: var(--font-size-sm);
    margin-top: var(--space-2);
  }

  .loading {
    text-align: center;
    color: var(--color-primary);
    font-size: var(--font-size-lg);
    margin: var(--space-8) 0;
  }

  .instructions h3 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    margin-bottom: var(--space-2);
    color: var(--color-primary);
  }

  .instructions ul {
    margin-top: var(--space-2);
    padding-left: var(--space-4);
  }

  .instructions li {
    margin-bottom: var(--space-2);
  }

  .instructions a {
    color: var(--color-primary);
    text-decoration: underline;
    transition: color var(--transition-fast);
  }

  .instructions a:hover {
    color: var(--color-primary-hover);
  }
</style>
