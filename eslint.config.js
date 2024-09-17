import sveltePlugin from 'eslint-plugin-svelte';
import prettierConfig from 'eslint-config-prettier';
import svelteParser from 'svelte-eslint-parser';

export default [
    {
        ignores: [
            '.DS_Store',
            'node_modules',
            '/build',
            '.svelte-kit',
            '/package',
            '/dist',
            '.env',
            '.env.*',
            '!.env.example',
            'pnpm-lock.yaml',
            'package-lock.json',
            'yarn.lock',
        ],
    },
    {
        files: ['**/*.svelte'],
        plugins: {
            svelte: sveltePlugin,
        },
        languageOptions: {
            parser: svelteParser,
            sourceType: 'module',
            ecmaVersion: 2020,
            parserOptions: {
                extraFileExtensions: ['.svelte'],
            },
            globals: {
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                process: 'readonly',
                module: 'readonly',
                global: 'readonly',
            },
        },
        rules: {
            // Svelte recommended rules
            ...sveltePlugin.configs.recommended.rules,

            // Prettier rules to avoid conflict with formatting
            ...prettierConfig.rules,
        },
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
        },
        rules: {
            ...prettierConfig.rules,
        },
    },
];
