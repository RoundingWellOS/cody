import fs from 'fs';

import _ from 'lodash';

import { icdCodesJsonFilePath, icdCodesCsvFilePath } from '.';

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

function writeCsvLibrary() {
    /**@type {Array<App.CodeEntry>} */
    const jsonLibrary = JSON.parse(fs.readFileSync(icdCodesJsonFilePath, 'utf8'));

    fs.writeFileSync(icdCodesCsvFilePath, mapCsv(jsonLibrary));
}

export default writeCsvLibrary;
