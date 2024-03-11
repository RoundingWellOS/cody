<script>
  import { onMount } from 'svelte';
  import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
  import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
  import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
  import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
  import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

  export let data = '';
  export let language = '';
  export let title = '';

  /**@type {HTMLElement}*/
  let container;

  onMount(async () => {
    self.MonacoEnvironment = {
      getWorker: function (_moduleId, label) {
        if (label === 'json') {
          return new jsonWorker();
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
          return new cssWorker();
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
          return new htmlWorker();
        }
        if (label === 'typescript' || label === 'javascript') {
          return new tsWorker();
        }
        return new editorWorker();
      },
    };

    const monaco = await import('monaco-editor');
    monaco.editor.create(container, {
      value: data,
      language,
      automaticLayout: true,
      readOnly: true,
    });
  });
</script>

<h1 class="title">{title}</h1>
<div class="container" bind:this={container}></div>

<style>
  .container {
    height: min(600px, 80vh);
  }

  .title {
    text-align: center;
  }
</style>
