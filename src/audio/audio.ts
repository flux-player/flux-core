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

  constructor() {
    this.context = new AudioContext({ latencyHint: "playback" });
  }

  /**
   * Create a new AudioBufferSourceNode
   */
  createSource() {
    // Sanity checking
    if (!this.currentAudioBuffer) return;

    // If there's an existing SourceNode, disconnect  it
    if (this.source) this.source.disconnect(this.context.destination);

    // Set the current source
    this.source = this.context.createBufferSource();

    // Connect new source to audio context
    this.source.connect(this.context.destination);

    // Set the audio source buffer to the buffer of the song we just got
    this.source.buffer = this.currentAudioBuffer;
  }

  /**
   * Start playback
   *
   * @param buffer
   */
  async play(buffer: ArrayBuffer) {
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
   * If there's a paused track, resume playback
   *
   */
  resume() {
    // Sanity checks
    if (!this.paused) return;

    // Create a new source node
    this.createSource();

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
  pause() {
    // Sanity checks
    if (!this.playing || !this.source) return;

    // Calculate how far in the track we are
    this.lastPlaytime =
      (Date.now() - this.startTimestamp) / 1000 + this.lastPlaytime;

    // Stop the source node from playing
    this.source.stop();

    // Update flags
    this.playing = false;
    this.paused = true;
  }

  /**
   * Stop playback
   */
  stop() {
    if (!this.source) return;

    // Stop playback
    this.source.stop();
    this.source.buffer = null;

    // Unset the current audio buffer
    this.currentAudioBuffer = undefined;

    // Update flags
    this.playing = false;
  }
}
