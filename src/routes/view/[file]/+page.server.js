import fs from 'fs';
import { resolve, join } from 'path';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    const { file } = params;
    const data = fs.readFileSync(resolve(join('src/files/output', file)), 'utf8');
    return { data, language: file.endsWith('.json') ? 'javascript' : 'csv', title: file };
}
