import { EventBus, log } from "@flux/utils";
import PlaylistCollection from "../store/collections/playlists";
import SongsCollection from "../store/collections/songs";
import { MediaScanner } from "./scanner";

export class Library {
    /**
     * Media scanner for reading media so we can add it into our library
     */
    private scanner: MediaScanner;

    /**
     * A collection of songs in our library
     */
    private songs: SongsCollection;

    /**
     * A collection of playlists in our library
     */
    private playlists: PlaylistCollection;

    /**
     * Event bus for broadcasting events to the other components in the application
     */
    eventBus: EventBus;

    constructor(
        scanner: MediaScanner,
        songCollection: SongsCollection,
        playlistCollection: PlaylistCollection,
        eventBus: EventBus
    ) {
        this.scanner = scanner;
        this.songs = songCollection;
        this.playlists = playlistCollection;
        this.eventBus = eventBus ?? new EventBus();

        this.eventBus.listen(
            "application.launches.first",
            this.onFirstRun.bind(this)
        );
    }

    /**
     * This is an event listener for when the application has been launched for the first time
     *
     * It will do it's initial scan of the user's music library
     */
    private async onFirstRun() {
        log("info", "Begin media scan");

        let songs = await this.scanner.scan();

        log("info", `Adding media to library, found ${songs.length} songs`);

        songs.forEach((song) => {
            this.songs.push(song);
        });

        this.songs.persist();
        log("info", `Media scan complete`);
    }
}
