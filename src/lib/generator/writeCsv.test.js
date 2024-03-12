import fs from 'fs';
import { resolve } from 'path';

import { describe, expect, it } from 'vitest';

import { mapCsv } from './writeCsv';

describe('mapCsv', async () => {
    it('should map the json to csv', () => {
        /**@type {Array<App.CodeEntry>} */
        const jsonLibrary = JSON.parse(
            fs.readFileSync(resolve('src/fixtures/output/icd_codes.json'), 'utf8'),
        );

        const output = fs.readFileSync(resolve('src/fixtures/output/icd_codes.csv'), 'utf8');

        expect(mapCsv(jsonLibrary)).toEqual(output);
    });
});
