import {TextDecode} from 'text-encoding'
/**
 * ID3v2 metadata comes at the beginning of the MP3 file and starts off with a 10 byte header.
 */
const HEADER_SIZE = 10;

/**
 * Grab the rest of the frame and decode the bytestream based on the encoding byte. For example, when encoding is set to
 * 0 we interpret the frame’s content as ascii.
 */
const ID3_ENCODINGS = [
    'ascii',
    'utf-16',
    'utf-16be',
    'utf-8'
];

/**
 * Types of frames which have a language identifier
 */
const LANG_FRAMES = [
    'USLT',
    'SYLT',
    'COMM',
    'USER'
];

/**
 * Break up synchsafe integer into 4 bytes, then combine them back with the 8th bit of each byte removed.
 *
 * @param sync
 *
 * @return Object The ID3 tag data
 */
const syncToInt = (sync: number) => {
    const mask = 0b01111111;

    let b1 = sync & mask;
    let b2 = (sync >> 8) & mask;
    let b3 = (sync >> 16) & mask;
    let b4 = (sync >> 24) & mask;

    return b1 | (b2 << 7) | (b3 << 14) | (b4 << 21);
};

/**
 * Parse an ID3 frame
 *
 * @param buffer Buffer to parse frame from
 * @param offset Where to start reading from in the buffer
 *
 * @return ID3 metadata
 */
const decodeFrame = (buffer: ArrayBufferLike, offset: number): PromiseLike<{ size: number, id: string, value: any, lang: any }> => {
    return new Promise<{ size: number, id: string, value: any, lang: any }>(((resolve, reject) => {
        let header = new DataView(buffer, offset, HEADER_SIZE + 1);
        if (header.getUint8(0) === 0) {
            return;
        }

        let id = decode('ascii', new Uint8Array(buffer, offset, 4));

        let size = header.getUint32(4);
        let contentSize = size - 1;
        let encoding = header.getUint8(HEADER_SIZE);

        let contentOffset = offset + HEADER_SIZE + 1;

        let lang;
        if (LANG_FRAMES.includes(id)) {
            lang = decode('ascii', new Uint8Array(buffer, contentOffset, 3));
            contentOffset += 3;
            contentSize -= 3;
        }

        let value = null;
        if (id !== 'APIC') {
            value = decode(ID3_ENCODINGS[encoding],
                new Uint8Array(buffer, contentOffset, contentSize));
        } else {
            value = new Uint8Array(buffer, contentOffset, contentSize);
        }

        if (!id || !value) reject("ID cannot be empty");

        resolve({
            id, value, lang,
            size: size + HEADER_SIZE
        });
    }));
};

/**
 * Decode the given data with the specified format
 *
 * @param format The encoding scheme to decode the data with
 * @param data The data to decode
 */
const decode = (format: string, data: Uint8Array) => {
    return new TextDecoder(format).decode(data)
};

const read = async (buffer: ArrayBufferLike) => {
    let header = new DataView(buffer, 0, HEADER_SIZE);

    let size = syncToInt(header.getUint32(6));

    let offset = HEADER_SIZE;
    let id3Size = HEADER_SIZE + size;

    let data = [];

    while (offset < id3Size) {
        let frame = await decodeFrame(buffer, offset);
        if (!frame) {
            break;
        }

        data.push(frame);
        offset += frame.size;
    }

    return data;
};