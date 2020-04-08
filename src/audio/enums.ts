/**
 * Denotes how the player is repeating stuff
 *
 * single - The player is going to repeat the current song until the second coming
 * all - The player is going to repeat the current song until
 */
export enum RepeatMode {
    All = "all",
    Off = "off",
    Single = "single",
}

export type RepeatModeType = keyof typeof RepeatMode;

/**
 * Denotes the state of the player
 */
export enum PlayState {
    Playing = "playing",
    Stopped = "stopped",
    Paused = "paused",
}

export type PlayStateType = keyof typeof PlayState;

/**
 * The events that can be raised by the player
 *
 * state.stopped - The player has stopped playback. This is not raised when the user paused playback
 * state.playing - The player has started playback.
 * state.paused - The player has paused playback
 * state.seeking - The player is seeking on the track
 * repeat.mode.changed - The player's repeat mode has been changed
 * repeat.repeating - Fired once when repeat mode is set to single and the player is about to repeat the track
 * state.progress.change - Fired every second, when the progress of the track changed
 */
export enum PlayerEvent {
    Paused = "state.paused",
    Stopped = "state.stopped",
    Playing = "state.playing",
    Seeking = "state.seeking",
    Repeating = "repeat.repeating",
    ProgressUpdated = "state.progres.change",
    RepeatModeChanged = "repeat.mode.changed",
}

export type PlayerEventType = keyof typeof PlayerEvent;
