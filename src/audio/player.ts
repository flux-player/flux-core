import AudioPlayer from "./audio";
import {RepeatMode} from "./enums"
import Song from "../store/models/audio/song";
import Playlist from "../store/models/audio/playlist";
import {BroadcastsEvents, readFileAsArrayBuffer} from "@flux/utils";


export default class Player extends BroadcastsEvents {
    /**
     * Internal audio player (Wrapper around the web audio api)
     */
    private audioPlayer: AudioPlayer;

    /**
     * This sets the whether the player is repeating tracks, or playlists
     */
    private repeat: RepeatMode = "off";


    /**
     * The current song being played.
     */
    private currentSong: Song | undefined;

    /**
     * Denotes whether we're playing a single song or an entire playlist
     */
    protected singlePlayMode: boolean = false;

    /**
     * If we're playing a playlist, the position where we currently are in the current playlist
     */
    protected currentPlaylistPosition: number = -1;

    /**
     * The playlist currently being played.
     */
    private currentPlaylist: Playlist | undefined;


    constructor(repeatMode: RepeatMode = "single") {
        super();

        // Instantiate music player class
        this.audioPlayer = new AudioPlayer();

        // In the future, try to fetch this from the configuration values
        this.setRepeatMode(repeatMode);

        // Bind to some events in the internal audio player
        this.bindToEvents();
    }

    /**
     * Play the given song or playlist
     *
     * @param item The playlist or song to play
     * @param start If we're playing a playlist, the song in the playlist to play first
     */
    public async play(item: Song | Playlist, start: Song | undefined = undefined): Promise<void> {
        // Check if we're playing a single song
        if (item instanceof Song)
            return await this.playSingle(item);

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
    private async playPlaylist(playlist: Playlist, start: Song | undefined = undefined) {
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
    private async playSingle(song: Song) {
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

        // Play the song
        await this.audioPlayer.play(buffer);
    }

    /**
     * Sets the repeat mode of the player
     *
     * @param mode
     */
    public setRepeatMode(mode: RepeatMode) {
        this.repeat = mode;
    }

    /**
     * Bind to the internal audio player's events
     */
    private bindToEvents() {
        // this.audioPlayer.source.onended = async () => {
        //     // Playback has ended. Handle this
        // };
    }
}