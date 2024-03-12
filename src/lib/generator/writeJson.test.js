import fs from 'fs';
import { resolve } from 'path';

import { describe, expect, it } from 'vitest';

import { parseFiles } from './writeJson';

describe('parseFiles', async () => {
    it('should parse files to json', () => {
        // Parse ICD Code/Description text file
        const icdDescriptionFile = fs.readFileSync(
            resolve('src/fixtures/input/icd_descriptions.txt'),
            'utf8',
        );

        // Parse ICD-10/HCC Mapping CSV
        const hccMappingFile = fs.readFileSync(
            resolve('src/fixtures/input/hcc_mappings.csv'),
            'utf8',
        );

        const output = fs.readFileSync(resolve('src/fixtures/output/icd_codes.json'), 'utf8');

        expect(JSON.parse(parseFiles(icdDescriptionFile, hccMappingFile))).toEqual(
            JSON.parse(output),
        );
    });
});
