import { Album } from "../audio/album";
import { MediaScanner } from "./scanner";
import { EventBus } from "@flux-player/utils";
import SongsCollection from "../store/collections/songs";
import PlaylistCollection from "../store/collections/playlists";

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
     * A filter of sorts that returns the albums in the library
     *
     * @todo This needs to made more effecient. Cache results etc etc. Figure it out
     *
     */
    private get albums(): Array<Album> {
        // Create the output array and prepopulate it with a default 'Unknown Album' album
        // This will act as the default album for all songs which don't specify which
        // album they belong to
        let output: Array<Album> = [
            new Album(
                "Unknown Album",
                "Various Artists",
                [],
                "Unknown Year",
                ""
            ),
        ];

        // Iterate over all the songs in the library
        this.songs.data.forEach((song) => {

            // If a song doesn't specify an album then, let's push it to the 'Unknown Album' album
            if (!song.album) {
                return output[0].songs.push(song);
            }

            // Get the artist of the album
            let artist = song.albumArtist ?? "Unknown Artist";

            // Check if we'd already made an entry for this current album
            let index = output.findIndex(
                (album) =>
                    album.name === song.album && artist === album.albumArtist
            );

            // If we didn't already have an entry, then add a new album for this album
            if (index === -1) {
                return output.push(
                    new Album(
                        song.album,
                        artist,
                        [song],
                        song.year ?? "Unknown Year",
                        song.albumArt
                    )
                );
            }

            // Else just push to that existing album
            output[index].songs.push(song);
        });

        return output;
    }

    /**
     * Event bus for broadcasting events to the other components in the application
     */
    eventBus: EventBus;

    /**
     * Create a library instance
     *
     * @param scanner The media scanner that will be utilized by the library for media discovery
     * @param songs The collection of songs in the library
     * @param playlists The collection of playlists in the library
     * @param eventBus The event bus which the library will utilize to broadcast and listen for events
     */
    constructor(
        scanner: MediaScanner,
        songs: SongsCollection,
        playlists: PlaylistCollection,
        eventBus: EventBus
    ) {
        // Assign property values
        this.scanner = scanner;
        this.songs = songs;
        this.playlists = playlists;
        this.eventBus = eventBus ?? new EventBus();

        // Listen for the first launch event and scan for media
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
        // Scan our media directories for songs
        let songs = await this.scanner.scan();

        // Iterate over the results, adding each song to the playlist
        songs.forEach((song) => {
            this.songs.push(song);
        });

        // Persist the song collection to disk
        this.songs.persist();
    }
}
