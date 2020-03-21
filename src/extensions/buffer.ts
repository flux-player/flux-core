/**
 * Convert a Node buffer to a native JavaScript ArrayBuffer
 *
 * @param buffer
 *
 * @returns {ArrayBuffer}
 */
export function toArrayBuffer(buffer: Buffer) {
    let arrayBuffer = new ArrayBuffer(buffer.length);
    let view = new Uint8Array(arrayBuffer);

    for (let i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return arrayBuffer;
}

