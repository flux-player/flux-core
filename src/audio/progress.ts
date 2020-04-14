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
