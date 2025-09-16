import { resolve, join } from 'path';

const INPUT_DIR = 'src/files/input/';
const OUTPUT_DIR = 'src/files/output/';
const icdDescriptionsFilePath = (/** @type number */ year) => resolve(join(INPUT_DIR, `${ year }_icd_descriptions.txt`));
const hccMappingsFilePath = (/** @type number */ year) => resolve(join(INPUT_DIR, `${ year }_hcc_mappings.csv`));
const icdCodesJsonFilePath = (/** @type number */ year) => resolve(join(OUTPUT_DIR, `${ year }_icd_codes.json`));
const icdCodesCsvFilePath = (/** @type number */ year) => resolve(join(OUTPUT_DIR, `${ year }_icd_codes.csv`));

export {
    INPUT_DIR,
    OUTPUT_DIR,
    icdDescriptionsFilePath,
    hccMappingsFilePath,
    icdCodesJsonFilePath,
    icdCodesCsvFilePath,
};

export { default as writeJSONLibrary } from './writeJson';
export { default as writeCsvLibrary } from './writeCsv';
