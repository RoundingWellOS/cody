<script>
  import MonacoEditor from '$lib/components/MonacoEditor.svelte';
  export let data;
</script>

<MonacoEditor data={data.data} title="JSON Resource" language="json" />
