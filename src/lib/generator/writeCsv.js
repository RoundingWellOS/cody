import fs from 'fs';
import { join, dirname, resolve } from 'path';
import _ from 'lodash';

const __dirname = resolve(dirname(''));

function writeCsvLibrary() {
    /**@type {Array<App.CodeEntry>} */
    const jsonLibrary =  JSON.parse(fs.readFileSync(join(__dirname, 'src/assets/icd_codes.json'), 'utf8'));
    const head = 'code,description,hcc_v24,hcc_v28,is_billable,parent,children';
    const rows =  _.map(jsonLibrary, entry => {
        const parent = entry.parent ? entry.parent.code : '';
        const children = entry.children ? _.map(entry.children, 'code') : '';
        return `${ entry.code },"${ entry.description }",${ entry.hcc_v24 },${ entry.hcc_v28 },${ entry.is_billable },${ parent },${  children },`;
    });

    rows.unshift(head);

    fs.writeFileSync(join(__dirname, `src/assets/icd_codes.csv`), rows.join('\n'));
}

export default writeCsvLibrary;