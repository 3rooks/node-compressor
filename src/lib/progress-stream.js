import { Transform } from 'stream';

export class ProgressStream extends Transform {
    constructor(progressBar) {
        super();
        this.bar = progressBar;
    }

    _transform(chunk, encode, cb) {
        const chunkLength = Buffer.byteLength(chunk, encode);
        this.bar.increment(chunkLength);
        cb(null, chunk);
    }

    _final(cb) {
        this.bar.stop();
        cb(null);
    }
}
