import {readFile} from "./file"

/**
 * Convert a Node buffer to a native JavaScript ArrayBuffer
 *
 * @param buffer
 *
 * @returns {ArrayBuffer}
 */
export const toArrayBuffer = (buffer: Buffer) => {
    let arrayBuffer = new ArrayBuffer(buffer.length);
    let view = new Uint8Array(arrayBuffer);

    for (let i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return arrayBuffer;
};

/**
 * Read a file from the disk into an ArrayBuffer
 * @param filename
 */
export const readFileAsArrayBuffer = async (filename: string) => {
    let nativeBuffer = await readFile(filename);

    return toArrayBuffer(nativeBuffer);
};
