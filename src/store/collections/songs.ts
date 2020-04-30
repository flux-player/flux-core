import Song from "../models/audio/song";
import { Column, Structure, Collection } from "@flux-player/collections";

export default class SongsCollection extends Collection<Song> {
    constructor() {
        super();

        this.init();
    }

    // The name of the collection
    _name = "songs";

    // Define the structure of the collectiWWWon
    _structure = new Structure([
        new Column("title", "string", false),
        new Column("artist", "string", false),
        new Column("album", "string", false),
        new Column("albumArtist", "string", false),
        new Column("trackNumber", "number", false),
        new Column("trackTotal", "number", false),
        new Column("albumArt", "string", false),
        new Column("genre", "string", false),
        new Column("year", "string", false),
        new Column("publisher", "string", false),
        new Column("fileName", "string", false),
    ]);
}
