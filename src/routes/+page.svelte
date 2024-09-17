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

<h1 class="title">ICD-10 Library Generator</h1>
{#if loading}
  <p class="loading">Processing... this may take a few minutes. Time for coffee.</p>
{:else}
  <form class="form" method="POST" use:enhance={handleSubmit} enctype="multipart/form-data">
    <label class="label" for="icd_list">Add ICD-10 Code Description Text File</label>
    <input disabled={loading} class="input" name="icd_list" accept=".txt" type="file" />
    <label class="label" for="hcc_map">Add ICD-10 to HCC Mapping CSV File</label>
    <input disabled={loading} class="input" name="hcc_map" accept=".csv" type="file" />
    <button disabled={loading} class="submit">Generate Resources</button>
  </form>
  {#if form?.error}
    <p class="error">{form?.message}</p>
  {/if}
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
    text-align: center;
  }

  .form {
    display: flex;
    flex-direction: column;
  }

  .form,
  .instructions {
    max-width: 800px;
    margin: 0 auto;
  }

  .instructions {
    margin-top: 65px;
  }

  .label,
  .submit {
    margin-bottom: 8px;
    margin-top: 32px;
  }

  input[type='file']::file-selector-button,
  .submit {
    border: none;
    background-color: var(--secondary);
    color: var(--light);
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  input[type='file']::file-selector-button:hover,
  input[type='file']::file-selector-button:active,
  .submit:hover,
  .submit:active {
    background-color: var(--accent);
  }

  input[type='file']::file-selector-button:disabled,
  input[type='file']::file-selector-button:disabled,
  .submit:disabled,
  .submit:disabled {
    background-color: var(--secondary);
    cursor: not-allowed;
  }

  .error {
    color: #bf0603;
    text-align: center;
  }

  .loading {
    text-align: center;
  }
</style>
