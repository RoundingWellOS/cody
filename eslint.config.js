import js from '@eslint/js';
import sveltePlugin from 'eslint-plugin-svelte';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
    js.configs.recommended,
    ...sveltePlugin.configs['flat/recommended'],
    prettierConfig,
    ...sveltePlugin.configs['flat/prettier'],
    {
        ignores: [
            'node_modules/',
            'build/',
            '.svelte-kit/',
            'dist/',
            '.env',
            '.env.*',
            '!.env.example',
            'package-lock.json',
        ],
    },
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
];
