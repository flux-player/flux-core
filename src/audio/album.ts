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

    /**
     * Album constructor
     *
     * @param name The name of the album
     * @param albumArtist The artist of the album
     * @param songs The songs in the album
     * @param releaseYear The year the album was released
     * @param albumArt The album art of the album
     */
    constructor(name: string, albumArtist: string, songs: Song[], releaseYear: string, albumArt: string) {
        this.name = name;
        this.albumArtist = albumArtist;
        this.songs = songs;
        this.releaseYear = releaseYear;
        this.albumArt = albumArt;
    }
}
