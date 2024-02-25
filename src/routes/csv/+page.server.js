import fs from 'fs';
import { join, dirname, resolve } from 'path';

const __dirname = resolve(dirname(''));

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    const data = fs.readFileSync(join(__dirname, 'src/assets/icd_codes.csv'), 'utf8');	
    return {	data	};
}