/**
 * Denotes how the player is repeating stuff
 *
 * single - The player is going to repeat the current song until the second coming
 * all - The player is going to repeat the current song until
 */
export type RepeatMode = "single" | "all" | "off";

/**
 * The events that can be raised by the player
 *
 * state.stopped - The player has stopped playback. This is not raised when the user paused playback
 * state.playing - The player has started playback.
 * state.paused - The player has paused playback
 * state.seeking - The player is seeking on the track
 * repeat.mode.changed - The player's repeat mode has been changed
 * repeating - Fired once when repeat mode is set to single and the player is about to repeat the track
 */
export type PlayerEvent =
  | "state.stopped"
  | "state.playing"
  | "state.paused"
  | "state.seeking"
  | "repeat.mode.changed"
  | "repeating";
