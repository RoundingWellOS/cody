import { fail } from '@sveltejs/kit';
import { writeFileSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { writeJSONLibrary, writeCsvLibrary } from '$lib/generator';

const __dirname = resolve(dirname(''));

/**
 * Verify that the argument is a valid File
 * @param {File|string|null} arg 
 * @returns {boolean}
 */
function isValidFile(arg) {
    return !!(arg && (typeof arg !== 'string') && arg.name !== 'undefined');
}

/** @type {import('./$types').Actions} */
export const actions = {	
    default: async ({ request }) => {
        const body = await request.formData();

        const descriptionFile = body.get('icd_list');
        const mappingFile = body.get('hcc_map');
        
        if (!isValidFile(descriptionFile) || !isValidFile(mappingFile)) fail(400, { error: true, message: 'You must submit two valid files.' });

        // @ts-ignore
        writeFileSync(join(__dirname, 'src/files/icd_descriptions.txt'), Buffer.from(await descriptionFile.arrayBuffer()));
        // @ts-ignore
        writeFileSync(join(__dirname, `src/files/hcc_mappings.csv`), Buffer.from(await mappingFile.arrayBuffer()));
        
        writeJSONLibrary();
        writeCsvLibrary();

        return { success: true };
	},
};