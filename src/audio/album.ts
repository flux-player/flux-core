import { Song } from "..";

export class Album {
    /**
     * The name of the album
     */
    public name: string;

    /**
     * The artist who made the album
     */
    public albumArtist: string;

    /**
     * The songs in the album
     */
    public songs: Array<Song>;

    /**
     * The album art for the song
     */
    public albumArt: string;

    /**
     * The publisher of the song
     */
    public releaseYear: string;

    constructor(name: string, albumArtist: string, songs: Song[], releaseYear: string, albumArt: string) {
        this.name = name;
        this.albumArtist = albumArtist;
        this.songs = songs;
        this.releaseYear = releaseYear;
        this.albumArt = albumArt;
    }
}
