import fs from 'fs';
import _ from 'lodash';

import { parseRow, formatIcdWithPeriod } from '$lib/utils';

import { icdCodesJsonFilePath, hccMappingsFilePath, icdDescriptionsFilePath } from '.';

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

function writeJSONLibrary() {
    // Parse ICD Code/Description text file
    const icdDescriptionFile = fs.readFileSync(icdDescriptionsFilePath, 'utf8');

    // Parse ICD-10/HCC Mapping CSV
    const hccMappingFile = fs.readFileSync(hccMappingsFilePath, 'utf8');

    const results = parseFiles(icdDescriptionFile, hccMappingFile);

    // Write directory
    fs.writeFileSync(icdCodesJsonFilePath, results);
}

export default writeJSONLibrary;
