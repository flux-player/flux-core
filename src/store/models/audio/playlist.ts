import Song from "./song";
import {BaseModel} from "@flux/collections";

/**
 * Represents a single playlist
 */
export default class Playlist extends BaseModel {
    /**
     * The name of the playlist
     */
    public name: string;
    /**
     * A unique identifier for the
     */
    public uuid: string;
    /**
     * Unix timestamp for when the playlist was created
     */
    public createdAt: Number;
    /**
     * Collection of songs on the playlist
     */
    public songs: Song[];

    constructor(name: string, uuid: string, createdAt: Number, songs: Song[]) {
        super();

        this.name = name;
        this.uuid = uuid;
        this.createdAt = createdAt;
        this.songs = songs;
    }

    public getSongPosition(song: Song) {
        return this.songs.indexOf(song);
    }

    public getAtPosition(index: number) :  | Song {
        return this.songs[index];
    }
}