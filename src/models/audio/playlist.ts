import Song from "./song";

/**
 * Represents a single playlist
 */
export default class Playlist {
    constructor(name: string, uuid: string, createdAt: Number, songs: Song[]) {
        this.name = name;
        this.uuid = uuid;
        this.createdAt = createdAt;
        this.songs = songs;
    }

    /**
     * The name of the playlist
     */
    name: string;

    /**
     * A unique identifier for the
     */
    uuid: string;

    /**
     * Unix timestamp for when the playlist was created
     */
    createdAt: Number;

    /**
     * Collection of songs on the playlist
     */
    songs: Song[];
}