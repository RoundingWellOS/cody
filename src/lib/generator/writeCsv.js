import fs from 'fs';
import _ from 'lodash';

/**
 * @param {App.CodeEntry[]} jsonLibrary
 */
export function mapCsv(jsonLibrary) {
    const head = 'code,description,hcc_v24,hcc_v28,is_specific,parent,children';
    const rows = _.map(jsonLibrary, (entry) => {
        const parent = entry.parent ? entry.parent.code : '';
        const children = entry.children ? _.map(entry.children, 'code') : '';
        return `${entry.code},"${entry.description}",${entry.hcc_v24 || ''},${entry.hcc_v28 || ''},${entry.is_specific},${parent},${children},`;
    });
    rows.unshift(head);
    return rows.join('\n');
}

/**
 * Converts a JSON library file (array of App.CodeEntry objects) to CSV and writes it to disk.
 *
 * Reads the JSON content from jsonFilePath, parses it as an array of App.CodeEntry, transforms
 * the data to CSV format via mapCsv(jsonLibrary), and writes the resulting CSV string to csvFilePath.
 *
 * @param {string} jsonFilePath - Path to the source JSON file containing an array of App.CodeEntry objects.
 * @param {string} csvFilePath - Destination file path where the generated CSV content will be written (overwrites if existing).
 *
 * @throws {SyntaxError} If the JSON file content is not valid JSON.
 * @throws {Error} If reading from jsonFilePath or writing to csvFilePath fails (e.g., permissions, ENOENT).
 *
 * @see App.CodeEntry
 * @see mapCsv
 * @returns {void}
 */
function writeCsvLibrary(jsonFilePath, csvFilePath) {
    /**@type {Array<App.CodeEntry>} */
    const jsonLibrary = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

    fs.writeFileSync(csvFilePath, mapCsv(jsonLibrary));
}

export default writeCsvLibrary;
