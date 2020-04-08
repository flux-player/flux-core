import { Song } from "..";
import { ID3TagCollection, ID3Frame } from "../audio/metadata/id3";

/**
 * Create a new song from the given tags
 * @param tags
 * @param filename
 */
export function createSongFromTags(
    tags: ID3TagCollection,
    filename: string
): Song {
    let song = new Song();
    tags.forEach((frame: ID3Frame) => {
        switch (frame.id) {
            case "TIT2":
                song.title = frame.value;
                break;
            case "TIT2":
                song.title = frame.value;
                break;
            case "TPE1":
                song.artist = frame.value;
                break;
            case "TPE2":
                song.albumArtist = frame.value;
                break;
            case "TALB":
                song.album = frame.value;
                break;
            case "TCON":
                song.genre = frame.value;
                break;
            case "TYER":
                song.year = frame.value;
                break;
            case "TPUB":
                song.publisher = frame.value;
                break;
            case "TRCK":
                song.trackTotal = frame.value;
                break;
            case "TPOS":
                song.trackNumber = frame.value;
                break;

            case "APIC":
                // TODO: Image needs to be saved somewhere then we can reference the file on disk instead.
                //  Storing the actual image data in memory will swallow up memory when the library is big enough
                //  Alternatively, album art can be read on the fly
                song.albumArt = "." ?? frame.value;
                break;
        }
    });
    song.fileName = filename;

    return song;
}
