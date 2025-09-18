import { fail } from '@sveltejs/kit';
import { writeFileSync } from 'fs';
import { parseYearFromName } from '$lib/utils';

import {
    writeJSONLibrary,
    writeCsvLibrary,
    icdDescriptionsFilePath,
    hccMappingsFilePath,
    icdCodesJsonFilePath,
    icdCodesCsvFilePath,
} from '$lib/generator';

/**
 * Verify that the argument is a valid File
 * @param {unknown} arg
 * @returns {arg is File}
 */
function isValidFile(arg) {
    return arg instanceof File && typeof arg.name === 'string' && arg.name.length > 0;
}

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ request }) => {
        const body = await request.formData();

        const descriptionFile = body.get('icd_list');
        const mappingFile = body.get('hcc_map');

        if (!isValidFile(descriptionFile) || !isValidFile(mappingFile)) {
            return fail(400, { error: true, message: 'You must submit two valid files.' });
        }

        const descriptionFileYear = parseYearFromName(descriptionFile.name);
        const mappingFileYear = parseYearFromName(mappingFile.name);

        if (!descriptionFileYear || mappingFileYear + 1 !== descriptionFileYear) {
            return fail(400, { error: true, message: 'Files are not from matching year.' });
        }

        const descriptionFilePath = icdDescriptionsFilePath(descriptionFileYear);
        const hccFilePath = hccMappingsFilePath(descriptionFileYear);
        const jsonFilePath = icdCodesJsonFilePath(descriptionFileYear);
        const csvFilePath = icdCodesCsvFilePath(descriptionFileYear);

        writeFileSync(descriptionFilePath, Buffer.from(await descriptionFile.arrayBuffer()));
        writeFileSync(hccFilePath, Buffer.from(await mappingFile.arrayBuffer()));

        writeJSONLibrary(descriptionFilePath, hccFilePath, jsonFilePath);
        writeCsvLibrary(jsonFilePath, csvFilePath);

        return { success: true };
    },
};
