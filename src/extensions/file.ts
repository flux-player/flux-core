import {
    writeFile as _writeFile,
    stat as _stat,
    readdir as _readDir,
    readFile as _readFile,
    Stats
} from "fs"
import {URL} from "url";
import {extname} from "path"

/**
 * Asynchronously writes data to a file, replacing the file if it already exists. data can be a string or a buffer.
 *
 * @param fileName  filename or file descriptor
 * @param data Data to write to file
 */
export const writeFile = (fileName: string | Buffer | URL, data: string | Buffer | Uint8Array): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        _writeFile(fileName, data, (err: any) => {
            if (err) reject(err);

            resolve();
        });
    });
};

/**
 * Asynchronously reads data from a file
 * If a file descriptor is provided, the underlying file will _not_ be closed automatically.
 *
 * @param fileName  filename or file descriptor
 */
export const readFile = (fileName: string | Buffer | URL): Promise<Buffer> => {
    return new Promise<Buffer>((resolve, reject) => {
        _readFile(fileName, (err: any, data) => {
            if (err) reject(err);

            resolve(data);
        });
    });
};

/**
 * Return information about a file, in the buffer
 *
 * @param path
 */
export const stat = (path: string | Buffer | URL): Promise<Stats> | PromiseLike<Stats> => {
    return new Promise<Stats>(((resolve, reject) => {
        _stat(path, (err, stats) => {
            if (err) return reject(err);

            resolve(stats);
        })
    }))
};

/**
 * Reads the contents of a directory.
 *
 * @param path
 */
export const readDir = (path: string | Buffer | URL): Promise<string[]> | PromiseLike<string[]> => {
    return new Promise<string[]>(((resolve, reject) => {
        _readDir(path, (err, files) => {
            if (err) return reject(err);

            resolve(files);
        })
    }))
};


/**
 * Check if a file has any of the extensions we want to check
 *
 * @param file The filename to check
 * @param extensions The extension to match
 */
export const hasAnyExtension = (file: string, extensions: string[]) => {
    let extension = extname(file);

    // Check if the file's extension matches any that we want
    let matches = extensions.filter(i => i.toLowerCase() === extension.toLowerCase());

    return matches.length > 0;
};
