import fs from 'fs';
import _ from 'lodash';
import { join, dirname, resolve } from 'path';
import { parseRow, formatIcdWithPeriod, isValidIcdLength } from '$lib/utils';

const __dirname = resolve(dirname(''));

/**
 * Parses a text file content into an array of objects containing code and description.
 * @param {string} textFile - The content of the text file as a string.
 * @returns {Array<App.CodeEntry>} An array of objects containing code and description extracted from each line of the text file.
 */
function parseTextFile(textFile) {
    return _.map(textFile.split('\r\n'), (string) => {
        const spaceIndex = string.indexOf(' ');
        const code = string.slice(0, spaceIndex).trim();
        return {
            code,
            description: string.slice(spaceIndex + 1).trim(),
        };
    });
}

/**
 * Parses a CSV file content into an array of objects containing code, description, and additional details.
 * @param {string} csvFile - The content of the CSV file as a string.
 * @returns {Array<App.CodeEntry>} An array of objects containing code, description, and additional details extracted from each line of the CSV file.
 */
function parseCsvFile(csvFile) {
    return _.reduce(
        csvFile.split('\r\n'),
        (memo, string) => {
            // Parse the CSV row into details
            const details = parseRow(string);
            const code = details[0];
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
            };

            // Check if there's a previous entry with the same code
            const prevEntry = _.find(memo, { code });

            // If a previous entry exists, merge the current data with it and push to the memo array
            if (prevEntry) {
                const mergedEntry = _.merge(obj, prevEntry);
                // @ts-ignore
                memo.push(mergedEntry);
                return memo;
            }

            // If no previous entry exists, push the current object to the memo array
            // @ts-ignore
            memo.push(obj);
            return memo;
        },
        [],
    );
}

/**
 * @typedef {{
 * "3": Array<App.CodeEntry>;
 * "4": Array<App.CodeEntry>;
 * "5": Array<App.CodeEntry>;
 * "6": Array<App.CodeEntry>;
 * "7": Array<App.CodeEntry>;
 * }} GroupedCodes
 */

/**
 * Group ICD-10 entries by length of code
 * @param {Array<App.CodeEntry>} mappedList
 * @returns {GroupedCodes}
 */
function groupByCodeLength(mappedList) {
    // @ts-ignore
    return _.omitBy(
        _.groupBy(mappedList, ({ code }) => code.length),
        (value, key) => !isValidIcdLength(Number(key)),
    );
}

/**
 * Creates a list with code associations based on the provided mapped list.
 * @param {Array<App.CodeEntry>} mappedList
 * @returns {Array<App.CodeEntry>}
 */
function createListWithCodeAssociations(mappedList) {
    // Group the mapped list by code length
    const groupedList = groupByCodeLength(mappedList);

    // Reduce the mapped list to create the list with code associations
    return _.reduce(
        mappedList,
        (memo, entry) => {
            // Get the length of the current entry's code
            const currentKey = entry.code.length;

            // Check if the current key is a valid ICD length
            if (!isValidIcdLength(currentKey)) return memo;

            // Array to store children codes
            /** @type {Array<App.CodeEntry>} */
            let children = [];

            // Iterate over each group in the groupedList
            _.forIn(groupedList, (array, key) => {
                const groupKey = Number(key);

                // Relate parent codes
                if (groupKey < currentKey) {
                    _.each(array, (item) => {
                        const splitCode = _.slice(entry.code, 0, groupKey).join('');
                        if (splitCode === item.code) entry.parent = _.omit(item, 'children');
                    });
                }

                // Relate children codes
                if (groupKey > currentKey) {
                    _.each(array, (item) => {
                        const splitCode = _.slice(item.code, 0, currentKey).join('');
                        if (splitCode === entry.code) children.push(_.omit(item, 'parent'));
                    });
                }
            });

            // Assign parent's hcc_v24 and hcc_v28 to the current entry
            if (entry.parent) {
                if (entry.parent.hcc_v24) entry.hcc_v24 = entry.parent.hcc_v24;
                if (entry.parent.hcc_v28) entry.hcc_v28 = entry.parent.hcc_v28;
            }

            // Assign children to the current entry
            if (children.length) {
                entry.children = children;
            }

            // Determine if the entry is most specific in category based on the presence of children
            entry.is_specific = !children.length;

            // Push the entry to the memo
            // @ts-ignore
            memo.push(entry);
            return memo;
        },
        [],
    );
}

/**
 * Iterates over array of Code Entries and adds a period to each ICD-10 Code
 * @param {Array<App.CodeEntry>} reducedList
 * @returns {Array<App.CodeEntry>}
 */
function formatAllCodesWithPeriod(reducedList) {
    return _.map(reducedList, (entry) => {
        entry.code = formatIcdWithPeriod(entry.code);

        if (entry.children)
            entry.children = _.map(entry.children, (child) => {
                child.code = formatIcdWithPeriod(child.code);
                return child;
            });

        if (entry.parent) entry.parent.code = formatIcdWithPeriod(entry.parent.code);
        return entry;
    });
}

function writeJSONLibrary() {
    // Parse ICD Code/Description text file
    const icdDescriptionFile = fs.readFileSync(
        join(__dirname, 'src/files/input/icd_descriptions.txt'),
        'utf8',
    );
    const icdList = parseTextFile(icdDescriptionFile);

    // Parse ICD-10/HCC Mapping CSV
    const icdMappingFile = fs.readFileSync(
        join(__dirname, `src/files/input/hcc_mappings.csv`),
        'utf8',
    );
    const hccList = parseCsvFile(icdMappingFile);

    // Join two parsed files
    const mappedList = _.unionBy(hccList, icdList, 'code');

    // Apply code associations
    const reducedList = createListWithCodeAssociations(mappedList);

    // Format all codes with period
    const results = formatAllCodesWithPeriod(reducedList);

    // Write directory
    fs.writeFileSync(
        join(__dirname, `src/files/output/icd_codes.json`),
        JSON.stringify(results, null, 4),
    );
}

export default writeJSONLibrary;
