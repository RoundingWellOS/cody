<script>
    import { enhance } from '$app/forms';
</script>

<h1 class="title">ICD-10 Library Generator</h1>
<form class="form" method="POST" use:enhance enctype="multipart/form-data">
    <label for="icd_list">Add ICD-10 Code Description Text File</label>
    <input class="input" name="icd_list" accept=".txt" type="file" />
    <label for="hcc_map">Add ICD-10 to HCC Mapping CSV File</label>
    <input class="input" name="hcc_map" accept=".csv" type="file" />
    <button class="submit">Generate Library</button>
</form>

<style>
    .title {
        text-align: center;
    }

    .form {
        max-width: 600px;
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
    .submit:hover,
    input[type=file]::file-selector-button:active,
    .submit:active {
        background-color: var(--accent);
    }
</style>