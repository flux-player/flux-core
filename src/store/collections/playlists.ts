import { Column, Structure, Collection } from "@flux/collections";
import Playlist from "../models/audio/playlist";

export default class PlaylistCollection extends Collection<Playlist> {
    constructor() {
        super();

        this.init();
    }

    // The name of the collection
    _name = "playlists";

    // Define the structure of the collection
    _structure = new Structure([
        new Column("name", "string", true),
        new Column("uuid", "string", true),
        new Column("createdAt", "string", true),
        new Column("songs", "Array", false),
    ]);
}
