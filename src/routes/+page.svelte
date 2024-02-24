<script>
    import { enhance } from '$app/forms';
</script>

<h1>ICD-10 Library Generator</h1>
<form method="POST" use:enhance enctype="multipart/form-data">
    <input name="icd_list" accept=".txt" type="file" />
    <input name="hcc_map" accept=".csv" type="file" />
    <button>Generate Library</button>
</form>
