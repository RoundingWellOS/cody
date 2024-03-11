import fs from 'fs';

import { icdCodesJsonFilePath } from '$lib/generator';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    const data = fs.readFileSync(icdCodesJsonFilePath, 'utf8');
    return { data };
}
