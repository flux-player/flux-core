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
}
