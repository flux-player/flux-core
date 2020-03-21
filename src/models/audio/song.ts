export default class Song {
    constructor(title: string, artist: string, album: string, albumArtist: string, trackNumber: number, trackTotal: number, albumArt: string, genre: string, year: string, publisher: string, fileName: string) {
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
    
    /**
     * The title of the song
     */
    title: string;

    /**
     * The name of the artist of the song
     */
    artist: string;

    /**
     * The name of the album of the song
     */
    album: string;

    /**
     * The artist of the album
     */
    albumArtist: string;

    /**
     * The number of the song in the album
     */
    trackNumber: number;

    /**
     * The total tracks in the album
     */
    trackTotal: number;

    /**
     * Full path to the album art file
     */
    albumArt: string;

    /**
     * The genre of the song
     */
    genre: string;

    /**
     * The year the song was released
     */
    year: string;

    /**
     * The name of publisher of the song
     */
    publisher: string;

    /**
     * The full path to the song file
     */
    fileName: string;


}