import { MediaScanner } from "./scanner";
import SongsCollection from "../store/collections/songs";
import PlaylistCollection from "../store/collections/playlists";
import { EventBus } from "@flux/utils";

export class Library {
    scanner: MediaScanner;
    songCollection: SongsCollection;
    playlistCollection: PlaylistCollection;
    eventBus: EventBus;

    constructor(
        scanner: MediaScanner,
        songCollection: SongsCollection,
        playlistCollection: PlaylistCollection,
        eventBus: EventBus
    ) {
        this.scanner = scanner;
        this.songCollection = songCollection;
        this.playlistCollection = playlistCollection;
        this.eventBus = eventBus ?? new EventBus();
    }


}
