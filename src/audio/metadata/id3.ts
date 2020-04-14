import { TextDecoder } from "text-encoding";
import {
    writeFile,
    getAppRootDirectory,
    env,
    randomString,
    ensureFilePathExists,
} from "@flux/utils";
import { join } from "path";

export type ID3FrameID = "TIT2" | "TPE1" | "TPE2" | "TALB" | "TCON" | "TYER" | "TPUB" | "TRCK" | "TPOS" | "APIC";

export interface ID3Frame {
    /**
     * The ID of the frame, refer to the ID3 spec to see all the available tags
     */
    id: ID3FrameID;

    /**
     * The value of the frame
     */
    value: any;

    lang: any;
    size: number;
}

export interface ID3TagCollection extends Array<ID3Frame> {}

/**
 * ID3v2 metadata comes at the beginning of the MP3 file and starts off with a 10 byte header.
 */
const HEADER_SIZE = 10;

/**
 * Possible values for encoding byte. For example, when encoding is set to
 * 0 we interpret the frame’s content as ascii.
 */
const ID3_ENCODINGS = ["ascii", "utf-16", "utf-16be", "utf-8"];

/**
 * Types of frames which have a language identifier
 */
const LANG_FRAMES = ["USLT", "SYLT", "COMM", "USER"];

/**
 * Break up synchsafe integer into 4 bytes, then combine them back with the 8th bit of each byte removed.
 *
 * @param sync
 *
 * @return Object The ID3 tag data
 */
function syncToInt(sync: number) {
    const mask = 0b01111111;

    let b1 = sync & mask;
    let b2 = (sync >> 8) & mask;
    let b3 = (sync >> 16) & mask;
    let b4 = (sync >> 24) & mask;

    return b1 | (b2 << 7) | (b3 << 14) | (b4 << 21);
}

/**
 * Parse an ID3 frame
 *
 * @param buffer Buffer to parse frame from
 * @param offset Where to start reading from in the buffer
 *
 * @todo Break down this method. It's become a monolith
 *
 * @return ID3 metadata
 */
async function decodeFrame(
    buffer: ArrayBufferLike,
    offset: number
): Promise<ID3Frame | null> {
    let header = new DataView(buffer, offset, HEADER_SIZE + 1);
    if (header.getUint8(0) === 0) {
        return null;
    }

    let id : ID3FrameID = (decode("ascii", new Uint8Array(buffer, offset, 4)) as unknown) as ID3FrameID ;

    let size = header.getUint32(4);
    let contentSize = size - 1;
    let encoding = header.getUint8(HEADER_SIZE);

    let contentOffset = offset + HEADER_SIZE + 1;

    let lang;
    if (LANG_FRAMES.includes(id)) {
        lang = decode("ascii", new Uint8Array(buffer, contentOffset, 3));
        contentOffset += 3;
        contentSize -= 3;
    }

    let value: Uint8Array | string;
    if (id !== "APIC") {
        value = decode(
            ID3_ENCODINGS[encoding],
            new Uint8Array(buffer, contentOffset, contentSize)
        );
    } else {
        value = new Uint8Array(buffer, contentOffset, contentSize);
    }

    if (!id || !value) throw new Error("ID cannot be empty");

    return {
        id,
        value,
        lang,
        size: size + HEADER_SIZE,
    };
}

async function saveAlbumArt(tags: ID3TagCollection) {
    // Get the index of the album art frame
    let index = tags.findIndex((frame: ID3Frame) => frame.id === 'APIC');

    // Check if the tag collection has the album art collection
    // If not, return the tag collection unchanged
    if(index === -1) return tags;

    // Generate the full filename
    let root = await getAppRootDirectory("Album Arts");

    // Ensure that the file exists. Create directory
    await ensureFilePathExists(root);

    // Join the filename to the directory
    let filename = join(
        root,
        randomString(16).concat(".jpg")
    );

    // Write the album art to the file
    writeFile(filename, tags[index].value.slice(13));

    // Set the value of the frame to the filename of the stored filename
    tags[index].value = filename;

    return tags;
}

/**
 * Decode the given data with the specified format
 *
 * @param format The encoding scheme to decode the data with
 * @param data The data to decode
 */
function decode(format: string, data: Uint8Array) {
    return new TextDecoder(format).decode(data);
}

/**
 * Read the tags from the specified data
 *
 * @param buffer The data to read from
 */
export async function read(buffer: ArrayBufferLike): Promise<ID3TagCollection> {
    let header = new DataView(buffer, 0, HEADER_SIZE);

    let size = syncToInt(header.getUint32(6));

    let offset = HEADER_SIZE;
    let id3Size = HEADER_SIZE + size;

    let data: ID3TagCollection = [];

    while (offset < id3Size) {
        let frame = await decodeFrame(buffer, offset);
        if (!frame) {
            break;
        }

        data.push(frame);
        offset += frame.size;
    }

    return data;
}
