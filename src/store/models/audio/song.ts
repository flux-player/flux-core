import { BaseModel } from "@flux/collections";
import { ID3TagCollection, ID3Frame } from "../../../audio/metadata/id3";

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

  /**
   * Create a new song from the given tags
   * @param tags
   * @param filename
   */
  static fromTags(tags: ID3TagCollection, filename: string): Song {
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
}
