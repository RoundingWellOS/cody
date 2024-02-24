<script>
    import { onMount } from 'svelte';
    export let data;
    /**@type {HTMLElement}*/
    let container;

    onMount(async () => {
        const monaco = await import('monaco-editor');
        monaco.editor.create(container, {
            value: data.data,
            language: 'json',
            automaticLayout: true,
        })
    });
</script>

<div class="container" bind:this={container}></div>

<style>
    .container {
        height: min(800px, 100vh);
    }
</style>