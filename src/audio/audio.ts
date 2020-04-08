export interface AudioProgress {
    /**
     * The position the player is at in the track, in seconds
     */
    position: number;

    /**
     * The duration of the track currently being played
     */
    duration: number;

    /**
     * Showing, 0 - 100 how far into the track we are
     */
    percentage: number;
}

export default class AudioPlayer {
    /**
     * The audio context being utilized by the audio player
     */
    public context: AudioContext;

    /**
     * The current source node
     */
    public source: AudioBufferSourceNode | undefined;

    /**
     * Gain node for the audio player
     */
    public gainNode: GainNode;

    /**
     * Boolean value indicating whether
     */
    public playing: boolean = false;

    /**
     * Boolean value indicating whether
     */
    public paused: boolean = false;

    /**
     * The time where we started playback
     */
    public startTimestamp: number = 0;

    /**
     * The current audio buffer of the song being played
     */
    private currentAudioBuffer: AudioBuffer | undefined;

    /**
     * Number representing, in seconds how far into a track we are
     */
    private lastPlaytime: number = 0;

    /**
     * Audio player constructor
     * @param startVolume The volume to start playback at
     */
    constructor(startVolume: number = 30) {
        this.context = new AudioContext({ latencyHint: "playback" });
        this.gainNode = this.context.createGain();

        this.gainNode.gain.value = startVolume / 100;
        this.gainNode.connect(this.context.destination);
    }

    /**
     * Create a new AudioBufferSourceNode
     */
    private createSource() {
        // Sanity checking
        if (!this.currentAudioBuffer) return;

        // If there's an existing SourceNode, disconnect  it
        if (this.source) this.source.disconnect(this.gainNode);

        // Set the current source
        this.source = this.context.createBufferSource();

        // Connect new source to audio context
        this.source.connect(this.gainNode);

        // Set the audio source buffer to the buffer of the song we just got
        this.source.buffer = this.currentAudioBuffer;
    }

    /**
     * Start playback
     *
     * @param buffer
     */
    public async play(buffer: ArrayBuffer) {
        // Sanity checking
        if (this.playing || !buffer) return;

        // Convert ArrayBuffer to AudioBuffer
        this.currentAudioBuffer = await this.context.decodeAudioData(buffer);

        // Create a new audio source node
        this.createSource();

        // This always evaluates to false, but typescript won't compile because it's not evaluating the assignment
        // Happing on the line above
        if (!this.source) return;

        // Start playback
        this.source.start();

        // Set the time we
        this.startTimestamp = Date.now();

        // Set our last playtimet to 0, the beginning of the track
        this.lastPlaytime = 0;

        // Set playing flag to true
        this.playing = true;
    }

    /**
     * Get the duration of the current track
     */
    public currentTrackDuration(): number {
        return this.currentAudioBuffer?.duration ?? 0;
    }

    /**
     * If there's a paused track, resume playback
     *
     */
    public resume(from: number = -1) {
        // Sanity checks
        if (!this.paused || !this.currentAudioBuffer?.duration) return;

        // Create a new source node
        this.createSource();

        // Check if the start time is not greater than duration of the track
        if (from > 0 && from < this.currentAudioBuffer.duration) {
            this.lastPlaytime = from;
        }

        this.startTimestamp = Date.now();
        // @ts-ignore
        // This source will always have a value because it's being assigned one on the statement before
        this.source.start(0, this.lastPlaytime);

        // Update flags
        this.paused = false;
        this.playing = true;
    }

    /**
     * If there's a playing track, pause it
     *
     */
    public pause(): void {
        // Sanity checks
        if (!this.playing || !this.source) return;

        // Calculate how far in the track we are
        this.lastPlaytime = this.calculatePosition();

        // Stop the source node from playing
        this.source.stop();

        // Update flags
        this.playing = false;
        this.paused = true;
    }

    /**
     * Get the current approximate progress of the track
     */
    protected calculatePosition(): number {
        return (Date.now() - this.startTimestamp) / 1000 + this.lastPlaytime;
    }

    /**
     * Get the current progress of the track being played
     */
    public progress(): AudioProgress {
        if (!this.playing || !this.source || !this.source.buffer)
            return { position: -1, duration: -1, percentage: -1 };

        let position = this.calculatePosition();
        let duration = this.source.buffer.duration;
        let percentage = (position / duration) * 100;

        // Cap the percentage to 100. In case it overflows,
        // the way we're calculating percentage is not super accurate
        if (percentage > 100) percentage = 100;

        return {
            percentage,
            duration: Math.round(duration),
            position: Math.round(position),
        };
    }

    /**
     * Stop playback
     */
    public stop(): void {
        if (!this.source) return;

        // Stop playback
        this.source.stop();
        this.source.buffer = null;

        // Unset the current audio buffer
        this.currentAudioBuffer = undefined;

        // Update flags
        this.playing = false;
        this.paused = false;
    }

    /**
     * If a track is paused, this sets where to resume the track from
     * @param position
     */
    public setLastTime(position: number): void {
        if (!this.paused) return;

        this.lastPlaytime = position;
    }

    /**
     * Set the volume of the player
     * @param value Set the volume of the player.
     */
    public volume(value: number): void {
        if (value < 0 || value > 100) return;

        // Update the gain of the
        this.gainNode.gain.value = value / 100;
    }
}
