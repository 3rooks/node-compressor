import createAsciiFiglet from '#lib/ascii-figlet.js';
import {
    assertDirectoryWritable,
    assertFileReadable
} from '#lib/assert-file.js';
import createProgressBar from '#lib/progress-bar.js';
import { ProgressStream } from '#lib/progress-stream.js';
import { BLUE, GREEN, RED } from '#utils/colors.js';
import { OUTPUT_PATH, pathResolved } from '#utils/paths.js';
import { createReadStream, createWriteStream } from 'fs';
import { unlink } from 'fs/promises';
import { emitKeypressEvents } from 'readline';
import { pipeline } from 'stream';
import { constants, createGzip } from 'zlib';

const bootstrap = async () => {
    try {
        const { FILE_PATH, OUTPUT_FILE } = await pathResolved();

        await assertFileReadable(FILE_PATH);
        await assertDirectoryWritable(OUTPUT_PATH);

        await createAsciiFiglet('Compressor');
        console.log(
            GREEN,
            'Compression in progress, press [p] to pause, press [c] to cancel'
        );

        const bar = await createProgressBar(FILE_PATH);
        const barStream = new ProgressStream(bar);

        const readFileStream = createReadStream(FILE_PATH);
        const gzipStream = createGzip({
            level: constants.Z_BEST_COMPRESSION
        });
        const writeFileStream = createWriteStream(OUTPUT_FILE);

        const keypressHandler = async (key) => {
            if (key === 'c') {
                try {
                    await unlink(OUTPUT_FILE);
                } catch (error) {}
                console.log(RED, '\nCompression cancelled');
                process.exit(1);
            } else if (!gzipStream.isPaused() && key === 'p') {
                gzipStream.pause();
                console.clear();
                await createAsciiFiglet('Compressor');
                console.log(
                    BLUE,
                    'Compression paused, press [r] to resume, press [c] to cancel'
                );
            } else if (gzipStream.isPaused() && key === 'r') {
                gzipStream.resume();
                console.clear();
                await createAsciiFiglet('Compressor');
                console.log(
                    GREEN,
                    'Compression resumed, press [p] to pause, press [c] to cancel'
                );
            }
        };
        emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);
        process.stdin.on('keypress', keypressHandler);

        pipeline(
            readFileStream,
            barStream,
            gzipStream,
            writeFileStream,
            async (err) => {
                if (err) {
                    try {
                        await unlink(OUTPUT_FILE);
                    } catch (error) {}
                    console.log(RED, 'Compression aborted');
                    process.emit(1);
                } else {
                    console.clear();
                    await createAsciiFiglet('Compressor');
                    console.log(GREEN, 'Compression finished');
                    process.stdin.setRawMode(false);
                    process.stdin.off('keypress', keypressHandler);
                    process.exit();
                }
            }
        );
    } catch (error) {
        console.log('ERROR', error);
        process.exit(1);
    }
};

bootstrap();
