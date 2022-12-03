import { readdir } from 'fs/promises';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(dirname(import.meta.url));
const INPUT_PATH = resolve(__dirname, '../../input');
const OUTPUT_PATH = resolve(__dirname, '../../output');

const pathResolved = async () => {
    const BASE_PATH = INPUT_PATH.replace(/\\/g, '/');
    const FILES = await readdir(BASE_PATH, { withFileTypes: true });
    const FILE_NAME = FILES[1].name;
    const FILE_PATH = `${BASE_PATH}/${FILE_NAME}`;
    const OUTPUT_FILE = `${OUTPUT_PATH}/${FILE_NAME}.gz`;

    return { FILE_PATH, OUTPUT_FILE };
};

export { OUTPUT_PATH, pathResolved };
