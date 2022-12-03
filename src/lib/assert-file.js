import { constants } from 'fs';
import { access } from 'fs/promises';

export const assertFileReadable = async (filePath) => {
    try {
        await access(filePath, constants.R_OK);
    } catch (error) {
        console.log('cannot read', error);
        process.exit(1);
    }
};

export const assertDirectoryWritable = async (directoryPath) => {
    try {
        await access(directoryPath, constants.W_OK);
    } catch (error) {
        console.log('cannot write', error);
        process.exit(1);
    }
};
