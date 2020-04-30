import Playlist from "../models/audio/playlist";
import { Column, Structure, Collection } from "@flux-player/collections";

export default class PlaylistCollection extends Collection<Playlist> {

    /**
     * Create a new instance of the playlist collection
     */
    constructor() {
        // Call base constructor
        super();

        // Initialize the collection
        this.init();
    }

    /**
     * The name of the collection
     */
    _name = "playlists";

    /**
     * Define the structure of the collection
     */
    _structure = new Structure([
        new Column("name", "string", true),
        new Column("createdAt", "string", true),
        new Column("songs", "Array", false),
    ]);
}
