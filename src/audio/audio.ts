export default class AudioPlayer {
    public context: AudioContext;

    public source: AudioBufferSourceNode;

    /**
     * Boolean value indicating whether
     */
    public playing: boolean = false;

    constructor() {
        this.context = new AudioContext({latencyHint: "playback"});
        this.source = this.context.createBufferSource();

        this.source.connect(this.context.destination);
    }

    /**
     * Start playback
     *
     * @param buffer
     */
    async play(buffer: ArrayBuffer) {
        if(this.playing) {
            this.stop();
        }

        // Set the audio source buffer to the buffer of the song we just got
        this.source.buffer = await this.context.decodeAudioData(buffer);

        // Start playback
        this.source.start();

        // Set playing flag to true
        this.playing = true;
    }

    /**
     * Stop playback
     */
    stop() {
        // Stop playback
        this.source.stop();
        this.source.buffer = null;

        // Set the playing flag to false
        this.playing = false;
    }
}