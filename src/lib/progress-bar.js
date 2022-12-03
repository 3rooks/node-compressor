import fixedMb from '#utils/fixed-mb.js';
import cliProgress from 'cli-progress';
import { stat } from 'fs/promises';

const createProgressBar = async (pathFile) => {
    const statFile = await stat(pathFile);

    const progressBar = new cliProgress.SingleBar(
        {
            format: 'Progress [{bar}] {percentage}% | {value}/{total}Mb | ETA: {eta}s | Duration: {duration}s',
            formatValue: (value, _, type) => {
                if (type !== 'total' && type !== 'value') return value;
                return fixedMb(value);
            }
        },
        cliProgress.Presets.legacy
    );
    progressBar.start(statFile.size, 0);
    return progressBar;
};

export default createProgressBar;
