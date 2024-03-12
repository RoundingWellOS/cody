import { resolve, join } from 'path';

const INPUT_DIR = 'src/files/input/';
const OUTPUT_DIR = 'src/files/output/';
const icdDescriptionsFilePath = resolve(join(INPUT_DIR, 'icd_descriptions.txt'));
const hccMappingsFilePath = resolve(join('hcc_mappings.csv'));
const icdCodesJsonFilePath = resolve(join(OUTPUT_DIR, 'icd_codes.json'));
const icdCodesCsvFilePath = resolve(join(OUTPUT_DIR, 'icd_codes.csv'));

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
