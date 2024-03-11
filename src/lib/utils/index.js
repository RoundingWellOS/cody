import _ from 'lodash';

/**
 * Parses a CSV row into an array of values.
 * @param {string} inputString - The CSV row string to parse.
 * @returns {string[]} An array of values parsed from the CSV row.
 */
export function parseRow(inputString) {
    const values = [];
    let currentValue = '';
    let insideQuotes = false;

    for (let i = 0; i < inputString.length; i++) {
        const char = inputString[i];

        if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
            values.push(currentValue);
            currentValue = '';
        } else {
            currentValue += char;
        }
    }

    // Add the last value after the loop
    values.push(currentValue);

    return values;
}

/**
 * Formats an ICD code by inserting a period after the third character.
 * @param {string} string - The input string representing the ICD code.
 * @returns {string} The formatted ICD code.
 */
export function formatIcdWithPeriod(string) {
    const trimmed = string.trim();
    if (trimmed.length < 4) return trimmed;
    return trimmed.slice(0, 3) + '.' + trimmed.slice(3);
}

/**
 * Checks if the provided length represents a valid ICD code length.
 * @param {number} length - The ICD code length.
 * @returns {boolean} True if the length is within the valid range (3 to 7), false otherwise.
 */
export function isValidIcdLength(length) {
    // Valid ICD codes are between 3 and 7 characters long without a period
    return _.inRange(length, 3, 8);
}
