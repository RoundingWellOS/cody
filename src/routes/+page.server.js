import { fail } from '@sveltejs/kit';
import { writeFileSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { writeJSONLibrary, writeCsvLibrary } from '$lib/generator';

const __dirname = resolve(dirname(''));

/**
 * Verify that the argument is a valid File
 * @param {File|null|string} arg 
 * @returns {boolean}
 */
function isValidFile(arg) {
    return !!(arg instanceof File && arg.name);
}

/** @type {import('./$types').Actions} */
export const actions = {	
    default: async ({ request }) => {
        const body = await request.formData();

        const descriptionFile = body.get('icd_list');
        const mappingFile = body.get('hcc_map');
        
        if (!isValidFile(descriptionFile) || !isValidFile(mappingFile)) return fail(400, { error: true, message: 'You must submit two valid files.' });

        // @ts-ignore
        writeFileSync(join(__dirname, 'src/files/input/icd_descriptions.txt'), Buffer.from(await descriptionFile.arrayBuffer()));
        // @ts-ignore
        writeFileSync(join(__dirname, `src/files/input/hcc_mappings.csv`), Buffer.from(await mappingFile.arrayBuffer()));
        
        writeJSONLibrary();
        writeCsvLibrary();

        return { success: true };
	},
};