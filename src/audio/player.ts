import Song from "../store/models/audio/song"
import Playlist from "../store/models/audio/playlist";
import { BroadcastsEvents } from "@flux/utils"
import {readFileAsArrayBuffer} from "@flux/utils";

export default class Player extends BroadcastsEvents {
    public play(item: Song | Playlist, start: Song | undefined = undefined): void {
        // Check if we're playing a single song
        if (item instanceof Song)
            return this.playSingle(item);

        // We're in playlist mode.
        // If we were given a start position, play the playlist passing in the start position
        return this.playPlaylist(
            item,
            start
        );
    }

    /**
     * Loads up and plays a playlist
     *
     * @param playlist The playlist to play
     * @param start If specified the song to start playing
     */
    private playPlaylist(playlist: Playlist, start: Song | undefined = undefined) {
        // Are there any songs in the playlist
        if(!playlist.songs.length) return;

        // Set the position in the playlist to start playback
        this.currentPlaylistPosition = start ? playlist.getSongPosition(start as Song) : 0;

        // We're not playing singles
        this.singlePlayMode = false;

        // Set the current playlist
        this.currentPlaylist = playlist;

        // Set the current song
        this.currentSong = playlist.getAtPosition(this.currentPlaylistPosition);

        // Start de beatz
        this.beginPlay();
    }

    /**
     * Plays the specified song
     *
     * @param song
     */
    private playSingle(song: Song) {
        // Set the current song
        this.currentSong = song;

        // Start music play
        this.beginPlay();
    }

    /**
     * Load up and play the song currently in the currentSong property
     *
     */
    private async beginPlay() {
        if(!this.currentSong) return;

        // Load up the song into memory
        let buffer = await readFileAsArrayBuffer(this.currentSong.fileName);

        
    }

    private currentPlaylist: Playlist | undefined;
    private currentSong: Song | undefined;
    protected singlePlayMode: boolean = false;
    protected currentPlaylistPosition: number = -1;

}