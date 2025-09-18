<script>
  import MonacoEditor from '$lib/components/MonacoEditor.svelte';
  const { data } = $props();
</script>

<h1 class="title">{data.title}</h1>
<MonacoEditor {data} />

<style>
  .title {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--space-6);
    margin-top: var(--space-6);
    color: var(--color-primary);
    text-align: center;
  }
</style>
