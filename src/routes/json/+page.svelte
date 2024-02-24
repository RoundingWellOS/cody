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
            readOnly: true,
        })
    });
</script>


<h1 class="title">JSON Library</h1>
<div class="container" bind:this={container}></div>

<style>
    .container {
        height: min(600px, 80vh);
    }

    .title {
        text-align: center;
    }
</style>