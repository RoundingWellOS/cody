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
    <label for="icd_list">Add ICD-10 Code Description Text File</label>
    <input disabled="{loading}" class="input" name="icd_list" accept=".txt" type="file" />
    <label for="hcc_map">Add ICD-10 to HCC Mapping CSV File</label>
    <input disabled="{loading}"  class="input" name="hcc_map" accept=".csv" type="file" />
    <button disabled="{loading}"  class="submit">Generate Resources</button>
</form>
{#if form?.error}
<p class="error">{form?.message}</p>
{/if}
{/if}

<style>
    .title {
        text-align: center;
    }

    .form {
        max-width: 800px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    input[type=file]::file-selector-button,
    .submit {
        border: none;
        background-color: var(--secondary);
        color: var(--light);
        padding: 8px;
        border-radius: 4px;
        cursor: pointer;
        transition: all .2s ease;
    }

    input[type=file]::file-selector-button:hover,
    input[type=file]::file-selector-button:active,
    .submit:hover,
    .submit:active {
        background-color: var(--accent);
    }

    input[type=file]::file-selector-button:disabled,
    input[type=file]::file-selector-button:disabled,
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