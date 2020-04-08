import { env, walk } from "@flux/utils";

export class MediaScanner {
    /**
     * The directories to scan media files in
     */
    watchlist: Array<string>;

    /**
     * Create a new instance of the MediaScanner class
     * @param watchlist The directories to scan media files in
     */
    constructor(watchlist: Array<string> = []) {
        this.watchlist = watchlist;

        if(env('FLUX_SCAN_MODE', 'manual') !== 'auto') return;

        // Watch the watchlist for changes and add the new items to the library
        this.watch();
    }

    /**
     * Watches directories in the watchlist for changes and if there are any new media files, add them to the 
     * media library
     */
    private watch() {
        throw new Error("Method not implemented.");
    }

}