<script>
    import '@fontsource-variable/noto-sans';
    import '../global.css';
</script>

<header class="header">
    <a class="link title" href="/">RWell ICD-10 Library</a>
    <nav class="nav">
        <a class="link" href="/json">JSON</a>
        <a class="link" href="/csv">CSV</a>
    </nav>
</header>

<slot />

<style>
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: var(--primary);
        color: var(--light);
    }
    .title {
        font-weight: bold;
        margin-left: 16px;

    }
    .nav {
        display: flex;
        justify-content: flex-end;
        gap: 16px;
        margin: 16px;
    }

    .link {
        text-decoration: none;
        transition: color .2s ease;
    }

    .link:active,
    .link:hover {
        color: var(--accent);
    }

    .link:visited {
        color: var(--light);
    }
</style>