import fs from 'fs';

import { icdCodesCsvFilePath } from '$lib/generator';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    const data = fs.readFileSync(icdCodesCsvFilePath, 'utf8');
    return { data };
}
