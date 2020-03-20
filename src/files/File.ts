import {
    writeFile as _writeFile,
    stat as _stat,
    Stats
} from "fs"

import {URL} from "url";

/**
 * Asynchronously writes data to a file, replacing the file if it already exists. data can be a string or a buffer.
 *
 * @param fileName  filename or file descriptor
 * @param data Data to write to file
 */
const writeFile = (fileName: string | Buffer | URL, data: string | Buffer | Uint8Array): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        _writeFile(fileName, data, (err: any) => {
            if (err) reject(err);

            resolve();
        });
    });
};

/**
 * Return information about a file, in the buffer
 *
 * @param path
 */
const stat = (path: string | Buffer | URL): Promise<Stats> | PromiseLike<Stats> => {
    return new Promise<Stats>(((resolve, reject) => {
        _stat(path, (err, stats) => {
            if (err) return reject(err);

            resolve(stats);
        })
    }))
};