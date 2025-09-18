import fs from 'fs';
import _ from 'lodash';

import { parseRow, formatIcdWithPeriod } from '$lib/utils';

/**
 * Parses a text file content into an array of objects containing code and description.
 * @param {string} textFile - The content of the text file as a string.
 * @returns {Record<string, App.CodeEntry>} An object keyed by code containing code and description extracted from each line of the text file.
 */
function parseDescriptionFile(textFile) {
    return _.reduce(
        textFile.split(/\r\n|\n|\r/),
        (memo, string) => {
            const code = formatIcdWithPeriod(string.slice(0, 8));
            const description = string.slice(8);

            if (!code) return memo;

            // @ts-ignore
            memo[code] = { code, description, is_specific: true };

            return memo;
        },
        {},
    );
}

/**
 * Parses a CSV file content into an array of objects containing code, description, and additional details.
 * @param {string} csvFile - The content of the CSV file as a string.
 * @param {Record<string, App.CodeEntry>} icdList - The list of ICD codes from the descriptions file
 * @returns {Record<string, App.CodeEntry>} An object keyed by code containing code, description, and additional details extracted from each line of the CSV file.
 */
function parseHccMapping(csvFile, icdList) {
    let columnCount = 0;
    let parseHeader = false;
    let parseHeaderRow = false;
    let parseFooter = false;

    return _.reduce(
        csvFile.split(/\r\n|\n|\r/),
        (memo, string) => {
            if (!parseFooter && string.startsWith(',,,')) {
                if (!parseHeader) {
                    columnCount = string.split(',').length;
                    parseHeader = true;
                } else {
                    parseFooter = true;
                }

                return memo;
            }

            // Only parse between header and footer
            if (!parseHeader || parseFooter) return memo;

            // The first row is the header row
            if (!parseHeaderRow) {
                if (string.split(',').length < columnCount) return memo;
                parseHeaderRow = true;
            }

            // Parse the CSV row into details
            const details = parseRow(string);
            const code = formatIcdWithPeriod(details[0]);
            const description = details[1];
            // Parse HCC codes or set them to null if not present
            const hcc_v24 = details[5] ? parseInt(details[5], 10) : null;
            const hcc_v28 = details[6] ? parseInt(details[6], 10) : null;

            // Create an object containing the parsed data
            const obj = {
                code,
                description,
                hcc_v24,
                hcc_v28,
                is_specific: true,
            };

            memo[code] = _.merge(obj, memo[code]);

            return memo;
        },
        icdList,
    );
}
/**
 * @param {Record<string, App.CodeEntry>} directory object keyed by code containing code, description, and additional details extracted from each line of the CSV file.
 * @returns {Record<string, App.CodeEntry>} The mutated object with parent/child associations.
 */
function mutatedAssociations(directory) {
    _.forIn(directory, (entry, code) => {
        let parentCode = code;
        while (parentCode.length > 2) {
            // Skip the dot
            parentCode = parentCode.slice(0, parentCode.length === 5 ? -2 : -1);

            if (directory[parentCode]) {
                if (directory[parentCode].is_specific) {
                    directory[parentCode].children = [];
                    directory[parentCode].is_specific = false;
                }

                if (!entry.parent) entry.parent = _.omit(directory[parentCode], 'children');

                // @ts-ignore
                directory[parentCode].children.push(_.omit(entry, 'parent'));
            }
        }
    });

    return directory;
}

/**
 * @param {string} icdDescriptionFile
 * @param {string} icdMappingFile
 */
export function parseFiles(icdDescriptionFile, icdMappingFile) {
    const icdList = parseDescriptionFile(icdDescriptionFile);

    const directory = parseHccMapping(icdMappingFile, icdList);

    const results = _.orderBy(_.values(mutatedAssociations(directory)), 'code');

    return JSON.stringify(results, null, 4);
}

/**
 * Generates a JSON library by parsing an ICD code/description text file and an ICD-10 to HCC mapping CSV,
 * then writing the combined structured data to the specified JSON output path.
 *
 * This function:
 * 1. Reads a plain text file containing ICD codes and their descriptions.
 * 2. Reads a CSV file mapping ICD-10 codes to HCC (Hierarchical Condition Category) values.
 * 3. Uses an internal parser (parseFiles) to transform the raw inputs into a JSON-serializable structure or string.
 * 4. Writes the resulting JSON content to the provided output filepath.
 *
 * @param {string} descriptionPath - Absolute or relative path to the ICD code/description text file (UTF-8 encoded).
 * @param {string} hccPath - Absolute or relative path to the ICD-10/HCC mapping CSV file (UTF-8 encoded).
 * @param {string} jsonPath - Destination file path where the generated JSON content will be written.
 * @throws {Error} If any file read operation fails, if parsing fails, or if writing the output file fails.
 * @see parseFiles For the underlying transformation logic (must be available in scope).
 * @example
 * writeJSONLibrary(
 *   './data/icd_descriptions.txt',
 *   './data/icd_hcc_mapping.csv',
 *   './dist/icd_hcc_library.json'
 * );
 */
function writeJSONLibrary(descriptionPath, hccPath, jsonPath) {
    // Parse ICD Code/Description text file
    const icdDescriptionFile = fs.readFileSync(descriptionPath, 'utf8');

    // Parse ICD-10/HCC Mapping CSV
    const hccMappingFile = fs.readFileSync(hccPath, 'utf8');

    const results = parseFiles(icdDescriptionFile, hccMappingFile);

    // Write directory
    fs.writeFileSync(jsonPath, results);
}

export default writeJSONLibrary;
