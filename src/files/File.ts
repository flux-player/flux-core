import {writeFile as _writeFile} from "fs"

/**
 * Asynchronously writes data to a file, replacing the file if it already exists. data can be a string or a buffer.
 * @param fileName  filename or file descriptor
 * @param data Data to write to file
 */
const writeFile = (fileName: string | Buffer, data: string | Buffer | Uint8Array): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        _writeFile(fileName, data, (err: any) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};