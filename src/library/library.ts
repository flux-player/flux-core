import { MediaScanner } from "./scanner";
import SongsCollection from "../store/collections/songs";

export class Library {
    scanner: MediaScanner;
    songCollection: SongsCollection;
    playlistCollection: PlaylistCollection;

    constructor(
        scanner: MediaScanner,
        songCollection: SongsCollection,
        playlistCollection: PlaylistCollection,

    ) {
        this.scanner = scanner;
        this.songCollection = songCollection;
        this.playlistCollection = playlistCollection;
    }
}
