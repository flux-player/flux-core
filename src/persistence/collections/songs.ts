import Collection from "../collection";
import Structure from "../structure";
import {Column} from "../column";

export default class SongsCollection extends Collection {
    // The name of the collection
    _name = "songs";

    // Define the structure of the collection
    _structure = new Structure([
        new Column('title', 'string'),
        new Column('artist', 'string'),
        new Column('album', 'string'),
        new Column('albumArtist', 'string'),
        new Column('trackNumber', 'number'),
        new Column('trackTotal', 'number'),
        new Column('albumArt', 'string'),
        new Column('genre', 'string'),
        new Column('year', 'string'),
        new Column('publisher', 'string'),
        new Column('fileName', 'string'),
    ]);
}