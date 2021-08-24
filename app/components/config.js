import { readFile } from 'fs/promises';
import { load } from 'js-yaml';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const configDir = resolve(fileURLToPath(import.meta.url), '..', '..', 'config');

/** @arg {string} name */
export default async name => {
    const file = resolve(configDir, name + '.yml');
    const contents = await readFile(file, 'utf8');
    return load(contents);
}
