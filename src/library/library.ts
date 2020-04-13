import { EventBus, log } from "@flux/utils";
import PlaylistCollection from "../store/collections/playlists";
import SongsCollection from "../store/collections/songs";
import { MediaScanner } from "./scanner";
import { Album } from "../audio/album";

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
        let output: Array<Album> = [
            new Album("Unknown Album", "Various Artists", [], "Unknown Year", "")
        ];

        this.songs.data.forEach((song) => {
            if(!song.album) {
                return output[0].songs.push(song)
            }

            let artist = song.albumArtist ?? "Unknown Artist";
            let index = output.findIndex((album) => album.name === song.album && artist === album.albumArtist);

            if(index === -1) {
                return output.push(new Album(song.album, artist, [song], song.year ?? "Unknown Year", song.albumArt))
            }

            output[index].songs.push(song)
        })

        return output;
    }

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
