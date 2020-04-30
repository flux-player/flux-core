import Song from "./song";
import { BaseModel } from "@flux-player/collections";

/**
 * Represents a single playlist
 */
export default class Playlist extends BaseModel {
    /**
     * The name of the playlist
     */
    public name: string;

    /**
     * Unix timestamp for when the playlist was created
     */
    public createdAt: Number;

    /**
     * Collection of songs on the playlist
     */
    public songs: Song[];

    /**
     * Create a new playlist instance
     *
     * @param name The name of the playlist
     * @param createdAt Unix timestamp of when the playlist was created
     * @param songs The array of songs in the playlist
     */
    constructor(name: string, createdAt: Number, songs: Song[]) {
        super();

        this.name = name;
        this.createdAt = createdAt;
        this.songs = songs;
    }

    /**
     * Gets the index of the specified song in the playlist
     *
     * @param song The song to get the index for
     */
    public getSongPosition(song: Song) {
        return this.songs.indexOf(song);
    }

    /**
     * Gets the song at the specified index in the playlist
     *
     * @param index The index to get the song
     */
    public getAtPosition(index: number): Song {
        return this.songs[index];
    }
}
