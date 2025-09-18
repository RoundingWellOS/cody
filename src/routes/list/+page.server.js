import fs from 'fs';
import { resolve, join } from 'path';

export function load() {
    const files = fs.readdirSync(resolve(join('src', 'files', 'output')));

    /** @type {Record<string, string[]>} */
    const initial = {};

    const filesByYear = files.reduce((acc, file) => {
        const year = file.split('_')[0];
        if (!acc[year] && year.length === 4) {
            acc[year] = [];
        }
        if (acc[year]) acc[year].push(file);
        return acc;
    }, initial);

    return {
        filesByYear,
    };
}
