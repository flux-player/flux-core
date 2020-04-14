import { BaseModel } from "@flux/collections";

export default class Song extends BaseModel {
    /**
     * The title of the song
     */
    public title: string;

    /**
     * The name of the artist of the song
     */
    public artist: string;

    /**
     * The name of the album of the song
     */
    public album: string;

    /**
     * The artist of the album
     */
    public albumArtist: string;

    /**
     * The number of the song in the album
     */
    public trackNumber: number;

    /**
     * The total tracks in the album
     */
    public trackTotal: number;

    /**
     * Full path to the album art file
     */
    public albumArt: string;

    /**
     * The genre of the song
     */
    public genre: string;

    /**
     * The year the song was released
     */
    public year: string;

    /**
     * The name of publisher of the song
     */
    public publisher: string;

    /**
     * The full path to the song file
     */
    public fileName: string;

    /**
     * Create a new Song instance
     *
     * @param title The title of the song, default = ""
     * @param artist The artist of the song, default = ""
     * @param album The album of the song, default = ""
     * @param albumArtist The artist of the song album, default = ""
     * @param trackNumber The position of the song in its album, default = "0"
     * @param trackTotal The total numer of songs in the song's album, default = "0"
     * @param albumArt The album art of the song, default = ""
     * @param genre The genre of the song, default = ""
     * @param year The year the song was released, default = ""
     * @param publisher The publisher of the song, default = ""
     * @param fileName The file name of the song, default = ""
     */
    constructor(
        title: string = "",
        artist: string = "",
        album: string = "",
        albumArtist: string = "",
        trackNumber: number = 0,
        trackTotal: number = 0,
        albumArt: string = "",
        genre: string = "",
        year: string = "",
        publisher: string = "",
        fileName: string = ""
    ) {
        super();

        this.title = title;
        this.artist = artist;
        this.album = album;
        this.albumArtist = albumArtist;
        this.trackNumber = trackNumber;
        this.trackTotal = trackTotal;
        this.albumArt = albumArt;
        this.genre = genre;
        this.year = year;
        this.publisher = publisher;
        this.fileName = fileName;
    }
}
