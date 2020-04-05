import AudioPlayer, { AudioProgress } from "./audio";
import {RepeatMode, PlayerEvent, PlayState} from "./enums"
import Song from "../store/models/audio/song";
import Playlist from "../store/models/audio/playlist";
import {BroadcastsEvents, readFileAsArrayBuffer} from "@flux/utils";


export default class MusicPlayer extends BroadcastsEvents {
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

    /**
     * The current progress of the track being played, in seconds
     */
    private currentTrackProgress: AudioProgress = {position: -1, duration: -1};

    /**
     * The current play state of the music player
     */
    private state: PlayState = "stopped";

    /**
     * Handler for event tracker timeout 
     */
    private handle: NodeJS.Timeout | undefined;


    constructor(repeatMode: RepeatMode = "single") {
        super();

        // Instantiate music player class
        this.audioPlayer = new AudioPlayer();

        // In the future, try to fetch this from the configuration values
        this.setRepeatMode(repeatMode);
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

    public pause() {
        if(this.state !== "playing") return;

        // Pause the track
        this.audioPlayer.pause();

        // Fire the event for when track is paused
        this.raiseEvent('state.paused', null);

        // Stop progress tracking
        this.stopProgressTracking();
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
        this.currentSong = this.currentPlaylist.getAtPosition(this.currentPlaylistPosition);

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

        // Set the state to playing
        this.state = "playing";

        // Raise the event that we're playing a new song
        this.raiseEvent('state.playing', this.currentSong);

        // Being tracking the progress of the track
        this.trackProgress();
    }

    /**
     * Track the progress of the current song being played
     * 
     * @todo Remove direct references to the event, instead, import that value from some constant
     */
    private trackProgress() : void {
        this.handle = setInterval(() => {
            this.currentTrackProgress = this.audioPlayer.progress();
            
            this.raiseEvent('state.progress.changed', this.currentTrackProgress);
        }, 1000);
    }

    
    /**
     * Stops tracking the progress of the track and raising progress events
     */
    private stopProgressTracking() : void {
        if(!this.handle || !window) return;

        // Clear the progress track interval
        window.clearInterval(this.handle);
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
        if(!this.audioPlayer || !this.audioPlayer.source) return;

        this.audioPlayer.source.onended = async () => {
            this.audioPlayer.stop();
        };
    }
}